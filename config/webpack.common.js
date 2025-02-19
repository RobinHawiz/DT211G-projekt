const { populateHtmlPlugins } = require("../utils/multipage.js");
const pages = populateHtmlPlugins({
  index: ["main"],
  "find-match": ["main"],
});
const path = require("path");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
  entry: {
    main: path.resolve(__dirname, "../src/js/index.js"),
  },
  output: {
    assetModuleFilename: "img/[name][contenthash][ext][query]",
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "../dist"),
    },
    port: 8081,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
      {
        test: /\.(png|svg|jpe?g|gif|webp|avif)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "disabled",
      generateStatsFile: true,
    }),
  ].concat(pages),
};
