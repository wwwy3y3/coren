const webpack = require('webpack');

module.exports = {
  entry: {
    // root: './Root.js',
    index: './index.js'
  },
  webpack: {
    plugins: [
      new webpack.BannerPlugin('This file is created by coren. Built time: ' + new Date())
    ]
  },
  // assetsLink: key => {
    // return `https://s3-link/${key}`;
  // }
};
