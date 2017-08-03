const webpack = require('webpack');

module.exports = {
  entry: {
    index: './index.js'
  },
  wrapper: ['router', 'redux'],
  reduxStore: './configureStore.js',
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
  }
};
