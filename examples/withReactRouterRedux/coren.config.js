const Datastore = require('nedb');
const bluebird = require('bluebird');
const rp = require('request-promise');
const path = require('path');

module.exports = {
  entry: {
    index: './client/components/index.js',
    about: './client/components/about.js'
  },
  ssrWebpack: {
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
    const rel = path.relative(`${__dirname}/public/dist/`, absolutePath);
    switch (env) {
      case 'production':
        return `/dist/${rel}`;
      case 'development':
        return `http://localhost:5556/dist/${rel}`;
      default:
        return false;
    }
  }
};
