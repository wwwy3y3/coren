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
    index: [
      'webpack-dev-server/client?http://localhost:5556',
      'babel-polyfill',
      './index.js'
    ],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/dist'
  },
  resolve: {
    extensions: ['.js']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("development"),
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
