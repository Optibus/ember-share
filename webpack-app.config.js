const webpack = require("webpack");
const path = require("path");

module.exports = {
  entry: "./lib/ember-share.js",
  optimization: {
    minimize: false,
  },
  plugins: [
    new webpack.DefinePlugin({
      TEST_ENV: false,
    }),
  ],
  devtool: "source-map",
  // watch: process.env.DEVELOPMENT,
  mode: process.env.DEVELOPMENT ? "development" : "production",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    library: "ember-share",
    libraryTarget: "umd",
  },
};