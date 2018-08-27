const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HappyPack = require("happypack");
const { dir, checkDll } = require("./helper");

checkDll();

const dllManifest = require(dir("dll", "manifest.json"));

module.exports = {
  mode: "development",
  entry: {
    bundle: dir("src/main.js")
  },
  output: {
    path: dir("dist"),
    filename: "development.js",
    publicPath: "/"
  },
  resolve: {
    alias: {
      "@": dir("src")
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "happypack/loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    new HappyPack({
      loaders: [
        {
          loader: "babel-loader",
          options: { cacheDirectory: true }
        }
      ]
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DllReferencePlugin({
      context: ".",
      manifest: dllManifest
    }),
    new CopyWebpackPlugin([
      {
        from: dir("dll", "vendor.dll.js"),
        to: dir("dist", "vendor.dll.js")
      }
    ]),
    new HtmlWebpackPlugin({
      template: dir("src/index.html"),
      vendor: "/vendor.dll.js"
    })
  ],
  devServer: {
    hot: true,
    port: 8080,
    contentBase: dir("dist")
  }
};
