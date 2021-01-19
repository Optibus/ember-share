const path = require("path");

module.exports = {
  entry: "./lib/ember-share.js",
  watch: process.env.DEVELOPMENT,
  mode: process.env.DEVELOPMENT ? "development" : "production",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
};