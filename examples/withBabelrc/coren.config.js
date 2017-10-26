const webpack = require('webpack');
module.exports = {
  entry: {
    root: './Root.js',
    root2: './Root2.js'
  },
  webpack: {
    plugins: [
      new webpack.BannerPlugin('This file is created by coren. Built time: ' + new Date())
    ]
  }
};
