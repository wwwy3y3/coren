import cheerio from 'cheerio';
import {existsSync, readFileSync, lstatSync} from 'fs';
import path from 'path';
import {has} from 'lodash';
import {getSsrDir} from './coren-working-space';

const getEntryHtml = (reqPath, rootPath) => {
  let filePath = path.join(getSsrDir(rootPath), reqPath);
  if (existsSync(filePath) && lstatSync(filePath).isDirectory()) {
    filePath = `${filePath}/index.html`;
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
    let setHead;
    let preloadedState;

    res.sendCoren = function(reqPath) {
      let $ = cheerio.load(getEntryHtml(reqPath, rootPath));
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
