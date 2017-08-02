const webpack = require('webpack');
const ReduxCollector = require('./ReduxCollector');
const reducer = require('./reducer');

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
      reducers: reducer
    }));
    return app;
  }
};
