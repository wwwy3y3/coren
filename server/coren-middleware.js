import cheerio from 'cheerio';
import {existsSync, readFileSync, lstatSync} from 'fs';
import path from 'path';
import {has, isEmpty} from 'lodash';
import {getSsrDir} from './coren-working-space';

const getEntryHtml = (reqPath, rootPath) => {
  let filePath = path.join(getSsrDir(rootPath), reqPath);
  if (existsSync(filePath) && lstatSync(filePath).isDirectory()) {
    filePath = `${filePath}/index.html`;
  }

  return readFileSync(filePath, 'utf8');
};

const findCorenScript = $ => {
  let scriptTag;
  $('script').get().forEach(function(script) {
    if (has(script.attribs, 'data-coren')) {
      scriptTag = script;
    }
  });
  return scriptTag;
};

const updatePreloadedState = ($, newState) => {
  if (isEmpty(newState)) {
    return $;
  }

  const script = findCorenScript($);
  if (script) {
    const preloadStateTxt = script.children[0].data;
    const preloadState = JSON.parse(preloadStateTxt.replace('window.__PRELOADED_STATE__ =', ''));
    const mergeState = Object.assign({}, preloadState, newState);
    script.children[0].data = 'window.__PRELOADED_STATE__ = ' + JSON.stringify(mergeState);
  } else {
    // insert one
    $('head').append(`<script data-coren="">window.__PRELOADED_STATE__ = ${JSON.stringify(newState)}</script>`);
  }
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
      return res;
    };

    res.setPreloadedState = function(obj) {
      preloadedState = obj;
      return res;
    };
    next();
  };
};
