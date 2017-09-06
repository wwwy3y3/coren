const webpack = require('webpack');
const reducer = require('./reducer');
const Promise = require('bluebird');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const PreloadJsPlugin = require('./preloadJsPlugin');

const extractCSS = new ExtractTextPlugin({
  filename: 'css/[name].css',
  allChunks: true
});

module.exports = {
  entry: {
    index: './Home.js'
  },
  webpack: {
    plugins: [
      new webpack.BannerPlugin('This file is created by coren. Built time: ' + new Date()),
      extractCSS
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: extractCSS.extract(["css-loader?minimize"])
        }
      ]
    }
  },
  assetsHost: (env, absolutePath = '') => {
    const rel = path.relative(`${__dirname}/dist/`, absolutePath);
    switch (env) {
      case 'production':
      case 'development':
      case 'pre-production':
        return `http://localhost:5556/dist/${rel}`;
      default:
        return false;
    }
  },
  prepareContext: function() {
    return Promise.resolve({db: {auth: true}});
  },
  plugins: [
    new PreloadJsPlugin()
  ]
};
