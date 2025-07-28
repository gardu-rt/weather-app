const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    static: "./src",
    open: true,
    hot: true,
  },
  optimization: {
    runtimeChunk: "single",
  },
});
