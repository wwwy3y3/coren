const webpack = require('webpack');
const {ReduxCollector, HeadCollector, RoutesCollector} = require('coren');
const reducer = require('./reducer');
const Promise = require('bluebird');
const path = require('path');

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
      reducers: reducer,
      configureStore: path.resolve(__dirname, './configureStore')
    }));
    return app;
  },
  prepareContext: function() {
    return Promise.resolve({db: {auth: true}});
  }
};
