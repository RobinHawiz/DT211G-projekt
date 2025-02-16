const HtmlWebpackPlugin = require("html-webpack-plugin");

const generateHtmlPlugin = (pageName, chunks) => {
  if (pageName == "index") {
    return new HtmlWebpackPlugin({
      title: pageName,
      filename: `index.html`,
      chunks,
      template: `./src/pages/index.html`,
      scriptLoading: "blocking",
      inject: "body",
      minify: {
        collapseWhitespace: true,
        removeRedundantAttributes: false,
      },
    });
  } else {
    return new HtmlWebpackPlugin({
      title: pageName,
      filename: `${pageName}/index.html`,
      chunks,
      template: `./src/pages/${pageName}/index.html`,
      scriptLoading: "blocking",
      inject: "body",
    });
  }
};

const populateHtmlPlugins = (pageObject) => {
  let output = [];
  for (const [pageName, chunks] of Object.entries(pageObject)) {
    output.push(generateHtmlPlugin(pageName, chunks));
  }
  return output;
};

module.exports = { populateHtmlPlugins };
