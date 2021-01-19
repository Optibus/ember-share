const webpack = require("webpack");
const path = require("path");

module.exports = {
  mode: "development",
  optimization: {
    minimize: false,
  },
  devtool: "source-map",
  entry: "./test/js/tests.js",
  output: {
    filename: "tests.js",
    path: path.resolve(__dirname, "test"),
  },
  plugins: [
    new webpack.DefinePlugin({
      TEST_ENV: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /test\.js$/,
        use: "mocha-loader",
        exclude: /node_modules/,
      },
    ],
  },
};