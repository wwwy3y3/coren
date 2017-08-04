const webpack = require('webpack');

module.exports = {
  entry: {
    index: './index.js'
  },
  webpack: {
    plugins: [
      new webpack.BannerPlugin('This file is created by coren. Built time: ' + new Date())
    ]
  }
};
