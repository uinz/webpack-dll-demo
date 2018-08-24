const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
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
  plugins: [],
  resolve: {
    alias: {
      "@": dir("src")
    }
  }
};

const cssRule = {
  test: /\.css$/,
  use: ["css-loader"]
};

module.exports = (_, { mode }) => {
  const dllManifest = require(dir("dll", `manifest_${mode}.json`));

  if (mode === "development") {
    /* ====================== DEVELOPMENT ====================== */
    config.output.filename = `[name]_${mode}.js`;
    config.plugins.unshift(new webpack.HotModuleReplacementPlugin());
    config.devServer = {
      hot: true,
      port: 8080,
      contentBase: dir("dist")
    };

    cssRule.use.unshift("style-loader");
  } else if (mode === "production") {
    /* ====================== PRODUCTION ====================== */

    config.output.filename = `[name]_${mode}_[hash].js`;
    config.plugins.push(
      new MiniCssExtractPlugin({
        filename: "[name]_[chunkhash].css",
        chunkFilename: "[id]_[chunkhash].css"
      })
    );
    cssRule.use.unshift({ loader: MiniCssExtractPlugin.loader });
  }

  config.plugins.push(
    new webpack.DllReferencePlugin({
      context: ".",
      manifest: dllManifest
    }),
    new HtmlWebpackPlugin({
      template: dir("src/index.html"),
      dll: `${dllManifest.name}.js`,
      inject: false,
      minify: {
        minifyCSS: true,
        minifyJS: true,
        minifyURLs: true,
        removeComments: true,
        removeAttributeQuotes: true,
        collapseWhitespace: true
      }
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
  );

  config.module.rules.push(babelRule);
  config.module.rules.push(cssRule);

  return config;
};
