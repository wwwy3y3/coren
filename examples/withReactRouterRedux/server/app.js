const express = require('express');
const path = require('path');
const app = express();
const coren = require('coren/lib/server/coren-middleware');
app.use(coren(path.resolve(__dirname, '../')));
app.use(express.static(path.resolve(__dirname, '../public')));

app.get('/', function(req, res) {
  return res.sendCoren('/');
});

app.get('/about', function(req, res) {
  return res.sendCoren('/about');
});

app.get('/users', function(req, res) {
  return res.sendCoren('/users');
});

app.get('/users/:id', function(req, res) {
  try {
    return res.sendCoren(`/users/${req.params.id}`);
  } catch (err) {
    if (err.code === "ENOENT") {
      return res.status(404).send("not found user");
    }
    throw err;
  }
});

app.listen(9393, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:9393');
});
