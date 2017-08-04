const cheerio = require('cheerio');
const fs = require('fs');
const {has} = require('lodash');
const path = require('path');

const getEntryHtml = entry => {
  const filePath = path.join('./.coren/public/', `${entry}.html`);
  return fs.readFileSync(filePath, 'utf8');
};

module.exports = function() {
  return function corenMiddleware(req, res, next) {
    res.sendCoren = function(entry, options = {}) {
      // multi routes render
      // from index/users/1 => users/index/1
      if (entry.indexOf('/') >= 0) {
        const entries = entry.split('/').filter(val => val);

        // multi routes render
        if (entries.length > 1) {
          const firstEntry = entries[0];
          const newEntries = entries.slice(1);
          newEntries.push(firstEntry);
          entry = newEntries.join('/');
        }
      }

      // merge preloaded state
      if (options.updatePreloadedState) {
        const $ = cheerio.load(getEntryHtml(entry));
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
        res.send(getEntryHtml(entry));
      }
    };
    next();
  };
};
