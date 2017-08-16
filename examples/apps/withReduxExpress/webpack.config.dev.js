const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CorenWebpack = require('coren/lib/client/webpack');

function appendEntry() {
  return ['webpack-hot-middleware/client'];
}

const extractCSS = new ExtractTextPlugin({
  filename: 'css/[name].css',
  allChunks: true
});

const config = new CorenWebpack(__dirname, appendEntry, {
  // entry is defined in `coren.config.js`
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
    extractCSS
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader'
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: extractCSS.extract(["css-loader?minimize"])
      }
    ]
  }
});

module.exports = config.output();
