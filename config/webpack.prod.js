const path = require("path");
const common = require("./webpack.common.js");
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "js/[name].[contenthash].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
    ],
  },
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.sharpMinify,
        },
        generator: [
          {
            // You can apply generator using `?as=jpg`
            preset: "jpg",
            implementation: ImageMinimizerPlugin.sharpGenerate,
            options: {
              encodeOptions: {
                jpeg: {
                  quality: 70,
                },
              },
            },
          },
          {
            // You can apply generator using `?as=webp`
            preset: "webp",
            implementation: ImageMinimizerPlugin.sharpGenerate,
            options: {
              encodeOptions: {
                webp: {
                  quality: 85,
                },
              },
            },
          },
          {
            // You can apply generator using `?as=avif`
            preset: "avif",
            implementation: ImageMinimizerPlugin.sharpGenerate,
            options: {
              encodeOptions: {
                avif: {
                  quality: 60,
                },
              },
            },
          },
        ],
      }),
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "style/[name].[contenthash].css",
    }),
    new TerserWebpackPlugin({
      extractComments: false,
    }),
  ],
});
