const express = require("express");

const app = express();
const bodyParser = require("body-parser");
const shareDb = require("./sharedb");

module.exports = {
  start() {
    const allowCrossDomain = function f(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
      res.header("Access-Control-Allow-Headers", "Content-Type");

      return next();
    };

    app.use(allowCrossDomain);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static(`${__dirname}/public`));

    return new Promise((resolve) => {
      const server = app.listen(3333, function f() {
        console.log("");
        console.log("ShareDB OP Tests Webserver Running on port 3333!");
        console.log("");
        resolve();
      });

      const share = shareDb.init(server);
      const SDBConnection = share.connect();

      app.post("/op", function f(req, res) {
        const { id, op, collection } = req.body;

        // workaround for empty object properties being removed from the request body. Please fix it if you know how
        if (op.oi === '1') op.oi = {};
        if (op.od === '1') op.od = {};

        const doc = SDBConnection.get(collection, id);
        doc.fetch((err) => {
          if (err) {
            return res.send({ errorFetch: err });
          }
          try {
            doc.submitOp([op], (err) => {
              if (err) {
                console.error("Error");
                console.error(err);
              }
            });

            if (err != null) {
              return res.send({ errorSubmit: err });
            }
            res.send({ msg: "Success" });
          } catch (error) {
            console.log(error);
            res.send({ errors: error });
          }
        });
      });
    });
  },
};
