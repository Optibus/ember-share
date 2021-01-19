/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Primus = require("primus");
const ShareDB = require("sharedb");
const fs = require("fs");
const browserify = require("browserify")();
const uglifyJs = require("uglify-js");
const primusStream = require("./primus-stream");

module.exports = (() => {
  console.log(__dirname);
  const jsDir = `${__dirname}/public/`;
  const primusPath = `${__dirname}/public/primus.js`;
  const shareDbPath = `${__dirname}/public/share-client.js`;

  let primus = null;

  return {
    createClients(server) {
      // shareDb client
      const createDirs = (dir) => {
        if (!fs.existsSync(dir)) {
          return fs.mkdirSync(dir);
        }
        return false;
      };
      createDirs(`${__dirname}/public`);
      createDirs(jsDir);
      fs.writeFile(
        `${shareDbPath}-temp`,
        "window.sharedb = require('../../../../node_modules/sharedb/lib/client');",
        "utf-8",
        () => {}
      );
      browserify.add(`${shareDbPath}-temp`);
      browserify.bundle((err, buf) => {
        return fs.writeFile(
          shareDbPath,
          this.minify(buf.toString()),
          "utf-8",
          () => {}
        );
      });

      // primus client
      primus = new Primus(server, {
        transformer: "websockets",
        parser: "JSON",
      });
      fs.writeFile(
        primusPath,
        this.minify(primus.library().toString()),
        "utf-8",
        () => {}
      );
    },

    init(server) {
      this.createClients(server);

      const shareDb = new ShareDB();

      primus.on("connection", (spark) => shareDb.listen(primusStream(spark)));

      return shareDb;
    },

    minify(origCode) {
      return uglifyJs.minify(origCode, { fromString: true }).code;
    },
  };
})();
