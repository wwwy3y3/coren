import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import {has} from 'lodash';
import loadCorenConfig from './loadCorenConfig';
import loadAssetsJSON from './loadAssetsJSON';
import {ssrDir, getEnv} from './CONFIG';
const env = getEnv();

const htmlTemplate = `
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body><div id="root"></div></body>
</html>
`;

const assetRelative = (absolutePath, rootPath, corenCofig) => {
  let hostPath;
  if (env === 'production') {
    hostPath = corenCofig.assetsHost(absolutePath);
  }
  // if it isn't production & didn't define assetsHost func, use /assets/<file> to host
  if (!hostPath) {
    return path.sep + path.relative(`${rootPath}/coren-build/`, absolutePath);
  }
};

const appendAssets = ($, rootPath, corenCofig, entryAssets) => {
  if (entryAssets['.js']) {
    entryAssets['.js'].forEach(function(js) {
      $('body').append(`<script src="${assetRelative(js, rootPath, corenCofig)}"></script>`);
    });
  }
  if (entryAssets['.css']) {
    entryAssets['.css'].forEach(function(css) {
      $('head').append(`<link rel="stylesheet" href="${assetRelative(css, rootPath, corenCofig)}">`);
    });
  }
  return $;
};

const getEntryHtml = (entry, rootPath) => {
  // use different html template at different env
  if (env === 'production' || env === 'pre-production') {
    const filePath = path.join(ssrDir(rootPath), `${entry}.html`);
    return fs.readFileSync(filePath, 'utf8');
  } else if (env === 'development') {
    return htmlTemplate;
  }
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
  const corenCofig = loadCorenConfig(rootPath);
  const assetsJSON = loadAssetsJSON(rootPath);
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
      $ = appendAssets($, rootPath, corenCofig, assetsJSON[entry]);
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
