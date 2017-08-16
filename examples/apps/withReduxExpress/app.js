var express = require('express');
var app = express();
var coren = require('coren/lib/server/coren-middleware');
var webpack = require('webpack');

var webpackConfig = require('./webpack.config.dev');
var compiler = webpack(webpackConfig);

app.use(require("webpack-dev-middleware")(compiler, {
  noInfo: true, publicPath: webpackConfig.output.publicPath
}));

app.use(require("webpack-hot-middleware")(compiler));

app.use(coren(__dirname));

app.get('/', function(req, res) {
  return res.sendCoren('index', {updatePreloadedState: {auth: true}});
});

app.listen(9393, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:9393');
});
