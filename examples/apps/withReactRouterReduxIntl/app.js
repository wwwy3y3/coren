var express = require('express');
var app = express();
var coren = require('coren/lib/server/coren-middleware');
app.use(coren(__dirname));

app.get('/:locale', function(req, res) {
  const locale = req.params.locale;
  return res.sendCoren('/' + locale);
});

app.get('/:locale/photo/:id', function(req, res) {
  const locale = req.params.locale;
  const id = req.params.id;
  return res.sendCoren('/' + locale + '/photo/' + id);
});

app.get('/:locale/album/:id', function(req, res) {
  const locale = req.params.locale;
  const id = req.params.id;
  return res.sendCoren('/' + locale + '/album/' + id);
});

app.listen(9393, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:9393');
});
