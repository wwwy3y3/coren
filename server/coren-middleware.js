import cheerio from 'cheerio';
import {existsSync, readFileSync, lstatSync} from 'fs';
import path from 'path';
import {has} from 'lodash';
import {getSsrDir} from './coren-working-space';

const getEntryHtml = (entry, rootPath) => {
  let filePath = path.join(getSsrDir(rootPath), entry);
  if (existsSync(filePath) && lstatSync(filePath).isDirectory()) {
    filePath = `${filePath}/index.html`;
  } else {
    filePath = `${filePath}.html`;
  }

  return readFileSync(filePath, 'utf8');
};

const updatePreloadedState = ($, newState) => {
  $('script').get().forEach(function(script) {
    // find script with `data-coren` attr
    if (has(script.attribs, 'data-coren')) {
      const preloadStateTxt = script.children[0].data;
      const preloadState = JSON.parse(preloadStateTxt.replace('window.__PRELOADED_STATE__ =', ''));
      const mergeState = Object.assign({}, preloadState, newState);
      script.children[0].data = 'window.__PRELOADED_STATE__ = ' + JSON.stringify(mergeState);
    }
  });
  return $;
};

module.exports = function(rootPath) {
  return function corenMiddleware(req, res, next) {
    var setHead = null;
    var preloadedState = null;

    res.sendCoren = function(entry) {
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

      let $ = cheerio.load(getEntryHtml(entry, rootPath));
      if (preloadedState) {
        $ = updatePreloadedState($, preloadedState);
      }
      if (setHead) {
        const api = {
          append: content => {
            $('head').append(content);
          }
        };
        setHead(api);
      }
      res.send($.html());

      // init head & preloadedState
      setHead = null;
      preloadedState = null;
    };

    res.setHead = function(cb) {
      setHead = cb;
    };

    res.setPreloadedState = function(obj) {
      preloadedState = obj;
    };
    next();
  };
};
