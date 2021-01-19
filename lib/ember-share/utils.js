function guid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 3) | 8;
    return v.toString(16);
  });
}

/*
 * Software License Agreement (BSD License)
 *
 * Copyright (c) 2009-2011, Kevin Decker kpdecker@gmail.com
 *
 * Text diff implementation.
 *
 * This library supports the following APIS:
 * JsDiff.diffChars: Character by character diff
 * JsDiff.diffWords: Word (as defined by \b regex) diff which ignores whitespace
 * JsDiff.diffLines: Line based diff
 *
 * JsDiff.diffCss: Diff targeted at CSS content
 *
 * These methods are based on the implementation proposed in
 * "An O(ND) Difference Algorithm and its Variations" (Myers, 1986).
 * http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.4.6927
 * All rights reserved.
 */
function clonePath(path) {
  return { newPos: path.newPos, components: path.components.slice(0) };
}
const fbDiff = function (ignoreWhitespace) {
  this.ignoreWhitespace = ignoreWhitespace;
};
fbDiff.prototype = {
  diff(oldString, newString) {
    // Handle the identity case (this is due to unrolling editLength == 0
    if (newString === oldString) {
      return [{ value: newString }];
    }
    if (!newString) {
      return [{ value: oldString, removed: true }];
    }
    if (!oldString) {
      return [{ value: newString, added: true }];
    }

    newString = this.tokenize(newString);
    oldString = this.tokenize(oldString);

    const newLen = newString.length;
    const oldLen = oldString.length;
    const maxEditLength = newLen + oldLen;
    const bestPath = [{ newPos: -1, components: [] }];

    // Seed editLength = 0
    let oldPos = this.extractCommon(bestPath[0], newString, oldString, 0);
    if (bestPath[0].newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
      return bestPath[0].components;
    }

    for (let editLength = 1; editLength <= maxEditLength; editLength++) {
      for (
        let diagonalPath = -1 * editLength;
        diagonalPath <= editLength;
        diagonalPath += 2
      ) {
        var basePath;
        const addPath = bestPath[diagonalPath - 1];
        const removePath = bestPath[diagonalPath + 1];
        oldPos = (removePath ? removePath.newPos : 0) - diagonalPath;
        if (addPath) {
          // No one else is going to attempt to use this value, clear it
          bestPath[diagonalPath - 1] = undefined;
        }

        const canAdd = addPath && addPath.newPos + 1 < newLen;
        const canRemove = removePath && oldPos >= 0 && oldPos < oldLen;
        if (!canAdd && !canRemove) {
          bestPath[diagonalPath] = undefined;
          continue;
        }

        // Select the diagonal that we want to branch from. We select the prior
        // path whose position in the new string is the farthest from the origin
        // and does not pass the bounds of the diff graph
        if (!canAdd || (canRemove && addPath.newPos < removePath.newPos)) {
          basePath = clonePath(removePath);
          this.pushComponent(
            basePath.components,
            oldString[oldPos],
            undefined,
            true
          );
        } else {
          basePath = clonePath(addPath);
          basePath.newPos++;
          this.pushComponent(
            basePath.components,
            newString[basePath.newPos],
            true,
            undefined
          );
        }

        oldPos = this.extractCommon(
          basePath,
          newString,
          oldString,
          diagonalPath
        );

        if (basePath.newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
          return basePath.components;
        }
        bestPath[diagonalPath] = basePath;
      }
    }
  },

  pushComponent(components, value, added, removed) {
    const last = components[components.length - 1];
    if (last && last.added === added && last.removed === removed) {
      // We need to clone here as the component clone operation is just
      // as shallow array clone
      components[components.length - 1] = {
        value: this.join(last.value, value),
        added,
        removed,
      };
    } else {
      components.push({ value, added, removed });
    }
  },
  extractCommon(basePath, newString, oldString, diagonalPath) {
    const newLen = newString.length;
    const oldLen = oldString.length;
    let { newPos } = basePath;
    let oldPos = newPos - diagonalPath;
    while (
      newPos + 1 < newLen &&
      oldPos + 1 < oldLen &&
      this.equals(newString[newPos + 1], oldString[oldPos + 1])
    ) {
      newPos++;
      oldPos++;

      this.pushComponent(
        basePath.components,
        newString[newPos],
        undefined,
        undefined
      );
    }
    basePath.newPos = newPos;
    return oldPos;
  },

  equals(left, right) {
    const reWhitespace = /\S/;
    if (
      this.ignoreWhitespace &&
      !reWhitespace.test(left) &&
      !reWhitespace.test(right)
    ) {
      return true;
    }
    return left === right;
  },
  join(left, right) {
    return left + right;
  },
  tokenize(value) {
    return value;
  },
};
// copied from https://github.com/Dignifiedquire/share-primus/blob/master/lib/client/share-primus.js
function patchShare() {
  // Map Primus ready states to ShareJS ready states.
  const STATES = {};
  STATES[window.Primus.CLOSED] = "disconnected";
  STATES[window.Primus.OPENING] = "connecting";
  STATES[window.Primus.OPEN] = "connected";

  // Override Connection's bindToSocket method with an implementation
  // that understands Primus Stream.
  window.sharedb.Connection.prototype.bindToSocket = function (stream) {
    const connection = this;
    this.state =
      stream.readyState === 0 || stream.readyState === 1
        ? "connecting"
        : "disconnected";

    setState(Primus.OPENING);
    setState(stream.readyState);
    this.canSend = this.state === "connected"; // Primus can't send in connecting state.

    // Tiny facade so Connection can still send() messages.
    this.socket = {
      send(msg) {
        stream.write(msg);
      },
    };

    stream.on("data", function (msg) {
      if (msg.a) {
        try {
          connection.handleMessage(msg);
        } catch (e) {
          connection.emit("error", e);
          throw e;
        }
      }
    });

    stream.on("readyStateChange", function () {
      // console.log(stream.readyState);
      setState(stream.readyState);
    });

    stream.on("reconnecting", function () {
      if (connection.state === "disconnected") {
        setState(Primus.OPENING);
        connection.canSend = false;
      }
    });

    function setState(readyState) {
      const shareState = STATES[readyState];
      connection._setState(shareState);
    }
  };
}
const isArray =
  Array.isArray ||
  function (obj) {
    return obj instanceof Array;
  };
const diff = new fbDiff(false);
export { guid, diff, isArray, patchShare };
