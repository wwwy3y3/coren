const webpack = require('webpack');
const {ReduxCollector} = require('coren');
const reducer = require('./reducer');
const path = require('path');

module.exports = {
  entry: {
    index: './index.js'
  },
  wrapper: ['router', 'redux'],
  reduxStore: './configureStore.js',
  webpack: {
    plugins: [
      new webpack.BannerPlugin('This file is created by coren. Built time: ' + new Date())
    ]
  },
  customCollector: function(app) {
    app.registerCollector("redux", new ReduxCollector({
      componentProps: {db: {auth: false}},
      reducers: reducer,
      configureStore: path.resolve(__dirname, './configureStore')
    }));
    return app;
  }
};
