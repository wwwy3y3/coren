const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Datastore = require('nedb');
const bluebird = require('bluebird');
const rp = require('request-promise');
const ImmutableReduxCollector = require('./immutableReduxCollector');
const reducer = require('./reducer');

const extractCSS = new ExtractTextPlugin({
  filename: 'css/[name].css',
  allChunks: true
});
module.exports = {
  entry: {
    index: './index.js'
  },
  wrapper: ['router', 'redux'],
  reduxStore: './configureStore.js',
  webpack: {
    plugins: [
      new webpack.BannerPlugin('This file is created by coren. Built time: ' + new Date()),
      extractCSS
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
    ],
    rules: [
      {
        test: /\.css$/,
        use: extractCSS.extract(["css-loader?minimize"])
      }
    ]
  },
  customCollector: function(app, {db}) {
    app.registerCollector("redux", new ImmutableReduxCollector({
      componentProps: {db},
      reducers: reducer
    }));
    return app;
  },
  getDB: function() {
    const db = new Datastore();
    const Cursor = db.find().constructor;
    bluebird.promisifyAll(Datastore.prototype);
    bluebird.promisifyAll(Cursor.prototype);

    return rp('http://jsonplaceholder.typicode.com/users')
    .then(json => {
      return db.insertAsync(JSON.parse(json));
    })
    .then(() => {
      return {users: db};
    });
  }
};
