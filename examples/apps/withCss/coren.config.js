const webpack = require('webpack');
const {HeadCollector} = require('coren');

module.exports = {
  entry: {
    index: './index.js'
  },
  webpack: {
    plugins: [
      new webpack.BannerPlugin('This file is created by coren. Built time: ' + new Date())
    ]
  },
  registerCollector: function(app) {
    app.registerCollector("head", new HeadCollector());
    return app;
  }
};
