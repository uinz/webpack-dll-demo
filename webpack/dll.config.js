const webpack = require("webpack");
const { dir } = require("./helper");

const vendor = Object.keys(require("../package.json").dependencies);

module.exports = {
  mode: 'development',
  entry: {
    vendor
  },
  output: {
    path: dir("dll"),
    filename: "vendor.dll.js",
    library: "dll"
  },
  plugins: [
    new webpack.DllPlugin({
      context: ".",
      path: dir("dll", 'manifest.json'),
      name: "dll"
    })
  ]
};
