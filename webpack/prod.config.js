const HappyPack = require("happypack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { dir } = require("./helper");

module.exports = {
  mode: "production",
  entry: {
    main: dir("src/main.js")
  },
  output: {
    path: dir("dist"),
    filename: "[name].[chunkhash:6].js",
    publicPath: "/webpack-dll-demo/"
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
    new HtmlWebpackPlugin({
      template: dir("src/index.html"),
      minify: {
        minifyCSS: true,
        minifyURLs: true,
        removeComments: true,
        removeAttributeQuotes: true,
        collapseWhitespace: true
      }
    }),
    new HappyPack({
      loaders: [{ loader: "babel-loader" }]
    })
  ]
};
