const express = require('express');
const path = require('path');
const app = express();
const coren = require('coren/lib/server/coren-middleware');
app.use(coren(path.resolve(__dirname, '../')));
app.use(express.static(path.resolve(__dirname, '../public')));

const catchCoren = (corenResponse, res) => {
  try {
    return corenResponse();
  } catch (err) {
    if (err.code === "ENOENT") {
      return res.status(404).send("not found user");
    }
    throw err;
  }
};

app.get('/:locale', function(req, res) {
  const locale = req.params.locale;
  return catchCoren(() => res.sendCoren(`/${locale}`), res);
});

app.get('/:locale/photo/:id', function(req, res) {
  const locale = req.params.locale;
  const id = req.params.id;
  return catchCoren(() => res.sendCoren(`/${locale}/photo/${id}`), res);
});

app.get('/:locale/album/:id', function(req, res) {
  const locale = req.params.locale;
  const id = req.params.id;
  return catchCoren(() => res.sendCoren(`/${locale}/album/${id}`), res);
});

app.listen(9393, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:9393');
});
