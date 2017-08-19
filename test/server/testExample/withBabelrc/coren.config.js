const webpack = require('webpack');

module.exports = {
  entry: {
    index: './index.js'
  },
  webpack: {
    plugins: [
      new webpack.BannerPlugin('This file is created by coren. Built time: ' + new Date())
    ]
  },
  assetsHost: (env, absolutePath) => {
    switch (env) {
      case 'production':
        return 'https://s3-path/' + absolutePath;
      case 'development':
      case 'pre-production':
        return 'localhost:5555';
      default:
        return false;
    }
  }
};
