import {join, relative, resolve} from 'path';
import App from './app';
import {clientTmpEntryDir} from './CONFIG';
import webpack from './webpack';
import loadCorenConfig from './loadCorenConfig';
import fs from 'fs';
import mkdirp from 'mkdirp';

function addClientEntry(dir, config) {
  const {entry} = config;
  const clientEntryDir = clientTmpEntryDir(dir);
  mkdirp.sync(clientEntryDir);
  config.clientEntry = {};
  for (let key in entry) {
    const clientEntryPath = join(clientEntryDir, entry[key]);
    config.clientEntry[key] = clientEntryPath;
  }
  return config;
}

function createClientTmpEntryFile(dir, config) {
  let clientImport =
    `import React from 'react';
     import ReactDOM from 'react-dom';`;
  let clientRender = '<App/>';
  const {entry} = config;
  // use first entry js to get collector's wrapClientRender & wrapClientImport
  const firstKey = Object.keys(entry)[0];
  let app = new App({path: resolve(dir, '.coren', 'dist', `${firstKey}.commonjs2.js`)});
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
    const entryPath = entry[key];
    // clientTmpDir: /.coren/tmp
    const clientTmpDir = clientTmpEntryDir(dir);
    // clientEntryPath: /.coren/src/index.js
    const clientEntryPath = join(clientTmpDir, entryPath);
    // clientEntryDir: /.coren/src
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

export default function build(dir) {
  const config = loadCorenConfig(dir);
  const updatedCorenConfig = addClientEntry(dir, config);
  const {clientCompiler, serverCompiler} = webpack({dir, corenConfig: updatedCorenConfig});
  return new Promise((resolve, reject) => {
    // run server webpack & client webpack
    serverCompiler.run((err, stats) => {
      if (err) {
        return reject(err);
      }

      const jsonStats = stats.toJson();

      if (jsonStats.errors.length > 0) {
        const error = new Error(jsonStats.errors[0]);
        error.errors = jsonStats.errors;
        error.warnings = jsonStats.warnings;
        return reject(error);
      }
      // after server webpack compiled, load commonjs2 to collect client needed information
      createClientTmpEntryFile(dir, updatedCorenConfig);
      clientCompiler.run((err, stats) => {
        if (err) {
          return reject(err);
        }

        const jsonStats = stats.toJson();

        if (jsonStats.errors.length > 0) {
          const error = new Error(jsonStats.errors[0]);
          error.errors = jsonStats.errors;
          error.warnings = jsonStats.warnings;
          return reject(error);
        }
        resolve(jsonStats);
      });
    });
  });
}
