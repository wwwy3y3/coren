const express = require('express');
const path = require('path');
const app = express();
const coren = require('coren/lib/server/coren-middleware');
app.use(coren(path.resolve(__dirname, '../')));
app.use(express.static(path.resolve(__dirname, '../public')));

app.get('/*', function(req, res) {
  return res.setPreloadedState({auth: true}).sendCoren('/');
});

app.listen(9393, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:9393');
});
