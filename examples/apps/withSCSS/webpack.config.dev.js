const path = require('path');
const webpack = require('webpack');
const CorenWebpack = require('coren/lib/client/webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextPlugin({
  filename: 'css/[name].css',
  allChunks: true
});

const config = new CorenWebpack(__dirname, {
  // entry is defined in `coren.config.js`
  devServer: {
    headers: {"Access-Control-Allow-Origin": "http://localhost:9393"}
  },
  entry: {
    index: [
      'webpack-dev-server/client?http://localhost:5556',
      'babel-polyfill'
    ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: 'http://localhost:5556/dist/'
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
        NODE_ENV: JSON.stringify("development")
      }
    }),
    extractCSS
  ]
});

module.exports = config.output();
