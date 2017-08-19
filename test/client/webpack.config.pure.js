const webpack = require('webpack');
const path = require('path');

module.exports = {
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
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        test: /\.css$/
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({name: "$vendor", filename: "vendor.bundle.js"}),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("development")
      }
    })
  ]
};
