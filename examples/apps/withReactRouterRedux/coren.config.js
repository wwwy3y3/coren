const Datastore = require('nedb');
const bluebird = require('bluebird');
const rp = require('request-promise');
const {HeadCollector, RoutesCollector} = require('coren');
const ImmutableReduxCollector = require('./immutableReduxCollector');
const reducer = require('./reducer');
const path = require('path');

module.exports = {
  entry: {
    index: './index.js'
  },
  webpack: {
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
      reducers: reducer,
      configureStore: path.resolve(__dirname, './configureStore')
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
  },
  assetsHost: (env, absolutePath = '') => {
    const rel = path.relative(`${__dirname}/dist/`, absolutePath);
    switch (env) {
      case 'production':
        return `/dist/${rel}`;
      case 'development':
      case 'pre-production':
        return `http://localhost:5556/dist/${rel}`;
      default:
        return false;
    }
  }
};
