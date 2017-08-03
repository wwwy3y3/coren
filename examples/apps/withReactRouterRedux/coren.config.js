const webpack = require('webpack');
const Datastore = require('nedb');
const bluebird = require('bluebird');
const rp = require('request-promise');
const {HeadCollector, RoutesCollector} = require('coren');
const ImmutableReduxCollector = require('./immutableReduxCollector');
const reducer = require('./reducer');

module.exports = {
  entry: {
    index: './index.js'
  },
  webpack: {
    plugins: [
      new webpack.BannerPlugin('This file is created by coren. Built time: ' + new Date())
    ],
    // issue: https://github.com/matthew-andrews/isomorphic-fetch/issues/98
    externals: [
      {
        'isomorphic-fetch': {
          root: 'isomorphic-fetch',
          commonjs2: 'isomorphic-fetch',
          commonjs: 'isomorphic-fetch',
          amd: 'isomorphic-fetch'
        }
      }
    ]
  },
  registerCollector: function(app, {context}) {
    app.registerCollector("head", new HeadCollector());
    app.registerCollector("routes", new RoutesCollector({
      componentProps: {context}
    }));
    app.registerCollector("redux", new ImmutableReduxCollector({
      componentProps: {context},
      reducers: reducer
    }));
    return app;
  },
  prepareContext: function() {
    const db = new Datastore();
    const Cursor = db.find().constructor;
    bluebird.promisifyAll(Datastore.prototype);
    bluebird.promisifyAll(Cursor.prototype);

    return rp('http://jsonplaceholder.typicode.com/users')
    .then(json => {
      return db.insertAsync(JSON.parse(json));
    })
    .then(() => {
      return {db: {users: db}};
    });
  }
};
