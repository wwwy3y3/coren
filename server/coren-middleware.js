const cheerio = require('cheerio');
const fs = require('fs');
const {has} = require('lodash');

module.exports = function() {
  const htmls = {};
  const assets = JSON.parse(fs.readFileSync('./.coren/assets.json', 'utf8'));
  Object.keys(assets).forEach(function(asset) {
    htmls[asset] = fs.readFileSync('./.coren/public/' + asset + '.html', 'utf8');
  });
  return function corenMiddleware(req, res, next) {
    res.sendCoren = function(entry, options) {
      // merge preloaded state
      if (options.updatePreloadedState) {
        const $ = cheerio.load(htmls[entry]);
        $('script').get().forEach(function(script) {
          // find script with `data-coren` attr
          if (has(script.attribs, 'data-coren')) {
            const preloadStateTxt = script.children[0].data;
            const preloadState = JSON.parse(preloadStateTxt.replace('window.__PRELOADED_STATE__ =', ''));
            const mergeState = Object.assign({}, preloadState, options.updatePreloadedState);
            script.children[0].data = 'window.__PRELOADED_STATE__ = ' + JSON.stringify(mergeState);
          }
        });
        res.send($.html());
      } else {
        res.send(htmls[entry]);
      }
    };
    next();
  };
};
