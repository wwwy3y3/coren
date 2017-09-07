const path = require('path');
const webpack = require('webpack');
const {HeadCollector} = require('coren');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextPlugin({
  filename: 'css/[name].css',
  allChunks: true
});

module.exports = {
  entry: {
    index: './Content.js'
  },
  serverWebpack: {
    plugins: [
      new webpack.BannerPlugin('This file is created by coren. Built time: ' + new Date()),
      extractCSS
    ],
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: extractCSS.extract([
            "css-loader?minimize",
            "sass-loader"
          ])
        }
      ]
    }
  },
  registerCollector: function(app) {
    app.registerCollector("head", new HeadCollector());
    return app;
  },
  assetsHost: (env, absolutePath = '') => {
    const rel = path.relative(`${__dirname}/dist/`, absolutePath);
    switch (env) {
      case 'production':
        return `/dist/${rel}`;
      case 'development':
      case 'pre-production':
        return `http://localhost:5556/dist/${rel}`;
      default:
        return false;
    }
  }
};
