const path = require('path');
const webpack = require('webpack');
const CorenWebpack = require('coren/lib/client/webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextPlugin({
  filename: 'css/[name].css',
  allChunks: true
});

const config = new CorenWebpack(__dirname, {
  entry: {
    index: [
      './client/index.js'
    ]
  },
  output: {
    path: path.join(__dirname, 'public/dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: extractCSS.extract([
          "css-loader?minimize",
          "sass-loader"
        ])
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    }),
    extractCSS
  ]
});

module.exports = config.output();
