const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const localeData = require('./locales/data.json');
require('isomorphic-fetch');

const extractCSS = new ExtractTextPlugin({
  filename: 'css/[name].css',
  allChunks: true
});

module.exports = {
  entry: {
    index: './components/index.js'
  },
  ssrWebpack: {
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
    const rel = path.relative(`${__dirname}/dist/`, absolutePath);
    switch (env) {
        // return `/dist/${rel}`;
      case 'production':
      case 'development':
      case 'pre-production':
        return `http://localhost:5556/dist/${rel}`;
      default:
        return false;
    }
  },
  prepareContext: () => {
    return fetch("http://jsonplaceholder.typicode.com/albums")
            .then(albums => albums.json())
            .then(albumJson => {
              albumJson = albumJson.filter(item => {
                return item.id <= 2;
              });
              return fetch("http://jsonplaceholder.typicode.com/photos")
              .then(photos => photos.json())
              .then(photoJSON => {
                photoJSON = photoJSON.filter(item => {
                  return item.albumId <= 1;
                });
                return {albums: albumJson, photos: photoJSON, localeData};
              });
            });
  }
};
