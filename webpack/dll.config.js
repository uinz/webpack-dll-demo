const webpack = require("webpack");
const { dir } = require("./helper");

const vendor = Object.keys(require("../package.json").dependencies);

module.exports = (_, { mode }) => {
  return {
    entry: {
      vendor
    },
    output: {
      path: dir("dll"),
      filename: `dll_${mode}_[hash:4].js`,
      library: `dll_${mode}_[hash:4]`
    },
    plugins: [
      new webpack.DllPlugin({
        context: ".",
        path: dir("dll", `manifest_${mode}.json`),
        name: `dll_${mode}_[hash:4]`
      })
    ]
  };
};
