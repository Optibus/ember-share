import SubMixin from "./sub-mixin";
import Utils from "./utils";

const allButLast = function (arr) {
  return arr.slice(0, arr.length - 1);
};

//
//   Sub Array Class
//
//        this is An Ember Array Proxy, uses sub mixin and 'Use Sub Mixin'
//
//

export default function (SubMixin, GetterSettersMixin) {
  return Ember.ArrayProxy.extend(Ember.Evented, SubMixin, GetterSettersMixin, {
    _isArrayProxy: true,

    arrayContentDidChange(startIdx, removeAmt, addAmt) {
      const _removeAmt = removeAmt == null ? 0 : removeAmt * -1;
      if (_removeAmt + (addAmt == null) ? 0 : addAmt)
        Ember.get(this, "content").propertyDidChange("lastObject");
      return this._super.apply(this, arguments);
    },

    arrayContentWillChange(startIdx, removeAmt, addAmt) {
      const children = Ember.get(this, "_children");
      const childrenKeys = Object.keys(children);
      const prefix = Ember.get(this, "_prefix");
      const self = this;
      const utils = Utils(this);

      const replaceLastIdx = function (str, idx) {
        const arr = allButLast(str.split("."));
        return `${arr.join(".")}.${idx}`;
      };
      const _removeAmt = removeAmt == null ? 0 : removeAmt * -1;
      addAmt = addAmt == null ? 0 : addAmt;
      if (_removeAmt + addAmt)
        Ember.get(this, "content").propertyWillChange("lastObject");
      const childrenKeysReduced = _.reduce(
        childrenKeys,
        function (result, key) {
          if (allButLast(key.split(".")).join(".") == prefix) result.push(key);
          return result;
        },
        []
      );
      _.forEach(childrenKeysReduced, function (childKey) {
        const idx = +_.last(childKey.split("."));
        if (!isNaN(idx)) {
          const child = children[childKey];
          if (_removeAmt + addAmt == 0) {
            if (idx >= addAmt) {
              utils.removeChildren(childKey, true);
              Ember.get(self, "content").propertyWillChange("lastObject");
            }
          } else if (
            (addAmt && startIdx <= idx) ||
            (removeAmt && startIdx < idx)
          ) {
            const newIdx = idx + _removeAmt + addAmt;
            const newChildKey = replaceLastIdx(childKey, newIdx);
            childrenKeys
              .filter(function (childKeyA) {
                return childKeyA.match(new RegExp(`^${childKey}\\.`));
              })
              .forEach(function (grandChildKey) {
                const grandChild = children[grandChildKey];
                const newGrandChildKey = grandChildKey.replace(
                  new RegExp(`^${childKey}`),
                  newChildKey
                );
                grandChild.set("_prefix", newGrandChildKey);
                delete children[grandChildKey];
                children[newGrandChildKey] = grandChild;
              });
            delete children[childKey];
            const tempChild = {};
            tempChild[replaceLastIdx(childKey, newIdx)] = child;
            _.assign(children, tempChild);
            Ember.set(child, "_idx", newIdx);
          }
        }
      });
      return this._super.apply(this, arguments);
    },

    // useSubs:

    replaceContent(content, noSet) {
      let removeAmt;
      let addAmt;
      const prefix = Ember.get(this, "_prefix");
      const children = Ember.get(this, "_children");
      _.forEach(this.toArray(), function (value, index) {
        const child = children[`${prefix}.${index}`];
        if (child != null)
          if (content[index] != null)
            child.replaceContent(content[index], true);
          else {
            delete children[`${prefix}.${index}`];
            child.destroy();
          }
      });

      if (!noSet) this._set(prefix, content);

      Ember.set(this, "content", content);
      return this;
    },

    _submitOp(p, li, ld) {
      const path = this.get("_prefix").split(".");
      const op = {
        p: path.concat(p),
      };

      if (typeof li !== "undefined") op.li = li;

      if (typeof ld !== "undefined") op.ld = ld;

      if (li != null || ld != null) {
        return this.get("doc").submitOp([op]);
      }
    },

    objectAt(idx) {
      const content = this._super(idx);
      const prefix = this.get("_prefix");
      return this.useSubs(content, prefix, idx);
    },

    toJson() {
      const self = this;
      return _.map(this.toArray(), function (value) {
        if (typeof value === "string" || typeof value === "number")
          return value;
        return value.toJson();
      });
    },

    _replace(start, len, objects) {
      if (!_.isArray(objects)) {
        objects = [objects];
      }
      this.arrayContentWillChange(start, len, objects.length);
      const iterationLength = len > objects.length ? len : objects.length;
      for (let i = 0; i < iterationLength; i++) {
        const newIndex = i + start;
        let obj = objects.objectAt(i);
        if (obj != null) obj = obj.toJson == null ? obj : obj.toJson();
        let oldObj = this.objectAt(newIndex);
        if (oldObj != null)
          oldObj = oldObj.toJson == null ? oldObj : oldObj.toJson();
        this._submitOp(newIndex, obj, len > i ? oldObj : undefined);
      }
      this.arrayContentDidChange(start, len, objects.length);
      const realContent = this.get(`doc.data.${this.get("_prefix")}`);
      if (!_.isEqual(this.get("content"), realContent)) {
        this.onChangeDoc();
      }
      return this;
    },

    onChangeDoc: function () {
      // debugger
      // this.set ('content', this.get('doc.data.' + this.get('_prefix')))
      // Ember.run.next (this, function () P{})
      this.replaceContent(this.get(`doc.data.${this.get("_prefix")}`), true);
    }.observes("doc"),
  });
}
