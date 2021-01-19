/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Duplex } = require("stream");

module.exports = (spark) => {
  const stream = new Duplex({ objectMode: true });

  stream._write = (chunk, encoding, callback) => {
    if (spark.state !== "closed") {
      spark.write(chunk);
    }
    return callback();
  };

  stream._read = () => {};

  stream.headers = spark.headers;
  stream.remoteAddress = stream.address;
  spark.on("data", (data) => stream.push(JSON.parse(data)));
  stream.on("error", (msg) => spark.emit("error", msg));
  spark.on("end", () => {
    stream.emit("close");
    stream.emit("end");
    return stream.end();
  });

  return stream;
};
