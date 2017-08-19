import {join, relative, resolve} from 'path';
import App from './app';
import {outputCommonJSDir, clientTmpEntryDir} from './CONFIG';
import {isFile} from './utils';
import {isString, isArray} from 'lodash';
import fs from 'fs';
import mkdirp from 'mkdirp';

exports.addClientEntry = (dir, config) => {
  const {entry} = config;
  const clientEntryDir = clientTmpEntryDir(dir);
  config.clientEntry = {};
  for (let key in entry) {
    const entryPath = entry[key];
    let clientEntryPath;
    if (isString(entryPath)) {
      clientEntryPath = join(clientEntryDir, entryPath);
    } else if (isArray(entryPath)) {
      clientEntryPath = entryPath.map(path => {
        // if isFile: transform its path to .coren file, else: is node_module
        if (isFile(path)) {
          return join(clientEntryDir, path);
        }
        return path;
      });
    }
    config.clientEntry[key] = clientEntryPath;
  }

  return config;
};

exports.createClientTmpEntryFile = (dir, config) => {
  let clientImport =
    `import React from 'react';
     import ReactDOM from 'react-dom';`;
  let clientRender = '<App/>';
  const {entry} = config;
  // use first entry js to get collector's wrapClientRender & wrapClientImport
  const firstKey = Object.keys(entry)[0];
  let app = new App({path: resolve(outputCommonJSDir(dir), `${firstKey}.commonjs2.js`)});
  if (config.registerCollector) {
    app = config.registerCollector(app, {context: {}});
  }
  app.collectors.forEach(collector => {
    // collect wrapClientImport & wrapClientRender content
    if (collector.wrapClientImport) {
      clientImport += collector.wrapClientImport();
    }
    if (collector.wrapClientRender) {
      clientRender = collector.wrapClientRender(clientRender);
    }
  });
  clientRender =
    `ReactDOM.render(
      <div>
        ${clientRender}
      </div>
    , document.getElementById('root'));`;
  for (let key in entry) {
    // entryPath: ./src/index.js
    let entryPath = entry[key];
    if (isString[entryPath]) {
      entryPath = [entryPath];
    }
    for (let i in entryPath) {
      const path = entryPath[i];
      if (isFile(path)) {
        // clientTmpDir: /.coren/tmp
        const clientTmpDir = clientTmpEntryDir(dir);
        // clientEntryPath: /.coren/tmp/src/index.js
        const clientEntryPath = join(clientTmpDir, entryPath);
        // clientEntryDir: /.coren/tmp/src
        const clientEntryDir = resolve(clientEntryPath, '../');
        mkdirp.sync(clientEntryDir);
        // importPath
        const importPath = relative(clientEntryDir, join(dir, entryPath));
        const tmpJS =
          `${clientImport}
           import App from "${importPath}";
           ${clientRender}`;
        fs.writeFileSync(clientEntryPath, tmpJS, 'utf8');
      }
    }
  }
};
