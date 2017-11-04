const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CorenWebpack = require('coren/lib/client/webpack');

const extractCSS = new ExtractTextPlugin({
  filename: 'css/[name].css',
  allChunks: true
});

const config = new CorenWebpack(__dirname, {
  entry: {
    index: ['babel-polyfill', './client/index.js']
  },
  output: {
    path: path.join(__dirname, 'public/dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
        isBrowser: true
      }
    }),
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
});

module.exports = config.output();
