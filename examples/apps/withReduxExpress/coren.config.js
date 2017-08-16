const webpack = require('webpack');
const {ReduxCollector, HeadCollector, RoutesCollector} = require('coren');
const reducer = require('./reducer');
const Promise = require('bluebird');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const PreloadJsPlugin = require('./preloadJsPlugin');

const extractCSS = new ExtractTextPlugin({
  filename: 'css/[name].css',
  allChunks: true
});

module.exports = {
  entry: {
    index: './index.js'
  },
  webpack: {
    plugins: [
      new webpack.BannerPlugin('This file is created by coren. Built time: ' + new Date()),
      extractCSS
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: extractCSS.extract(["css-loader?minimize"])
        }
      ]
    }
  },
  assetsHost: (env, absolutePath = '') => {
    const rel = path.relative(`${__dirname}/coren-build/assets`, absolutePath);
    switch (env) {
      case 'production':
        return 'https://s3-path/' + absolutePath;
      case 'development':
      case 'pre-production':
        return `http://localhost:9393/dist/${rel}`;
      default:
        return false;
    }
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
  },
  plugins: [
    new PreloadJsPlugin()
  ]
};
