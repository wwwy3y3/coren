const webpack = require('webpack');
const {ReduxCollector, HeadCollector, RoutesCollector} = require('coren');
const reducer = require('./reducer');
const Promise = require('bluebird');

module.exports = {
  entry: {
    index: './index.js'
  },
  webpack: {
    plugins: [
      new webpack.BannerPlugin('This file is created by coren. Built time: ' + new Date())
    ]
  },
  registerCollector: function(app, {context}) {
    app.registerCollector("head", new HeadCollector());
    app.registerCollector("routes", new RoutesCollector({
      componentProps: {context}
    }));
    app.registerCollector("redux", new ReduxCollector({
      componentProps: {context},
      reducers: reducer
    }));
    return app;
  },
  prepareContext: function() {
    return new Promise(resolve => {
      resolve({
        db: {
          auth: true
        }
      });
    });
  }
};
