const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
const { dir } = require("./helper");

const config = {
  entry: {
    bundle: dir("src/main.js")
  },
  output: {
    path: dir("dist")
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        options: {
          cacheDirectory: true
        }
      }
    ]
  },
  resolve: {
    alias: {
      '@': dir('src'),
    }
  }
};

module.exports = (_, { mode }) => {
  const dllManifest = require(dir("dll", `manifest_${mode}.json`));

  config.plugins = [
    new webpack.DllReferencePlugin({
      context: ".",
      manifest: dllManifest
    }),
    new HtmlWebpackPlugin({
      template: dir("src/index.html"),
      dll: `${dllManifest.name}.js`,
      inject: false,
    }),
    new CopyWebpackPlugin([
      {
        from: dir("dll", `${dllManifest.name}.js`),
        to: dir("dist", `${dllManifest.name}.js`)
      }
    ]),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: "async"
    })
  ];

  if (mode === "devolopment") {
    config.output.filename = `[name]_${mode}.js`;
    config.plugins.unshift(new webpack.HotModuleReplacementPlugin());
    config.devServer = {
      hot: true,
      port: 8080,
      contentBase: dir("dist")
    };
  } else if (mode === "production") {
    config.output.filename = `[name]_${mode}_[hash].js`;
  }

  return config;
};
