var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './docs/index.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  resolve: {
    extensions: ['.js']
  },
  performance: {
    hints: false
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify("development")
      }
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: path.resolve(__dirname, "./node_modules")
      },
      {
        test: /\.css$/,
        loaders: [
          "style-loader",
          "css-loader"
        ],
        exclude: /flexboxgrid/
      },
      {
        test: /\.scss$/,
        loaders: [
          "style-loader?sourceMap",
          "css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]",
          "resolve-url-loader",
          "sass-loader?sourceMap"
        ],
        exclude: [/\.lib\.scss$/, /\.antd\.scss/]
      },
      {
        test: [/\.lib\.scss$/, /\.antd\.scss$/],
        loaders: [
          "style-loader",
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?modules',
        include: /flexboxgrid/
      },
      {
        test: /\.json$/,
        include: [/node_modules/],
        loader: 'json-loader'
      }
    ],
    noParse: /node_modules\/quill\/dist/
  }
};
