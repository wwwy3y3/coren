import {join, relative} from 'path';
import {wrappedEntryDir} from './CONFIG';
import webpack from './webpack';
import loadCorenConfig from './loadCorenConfig';
import fs from 'fs';
import mkdirp from 'mkdirp';

function getWrapper(config, tmpEntryDir, dir) {
  if (config.wrapper.includes('redux')) {
    if (!config.reduxStore) {
      throw new Error('You need to provide `reduxStore` path in your coren.config.js when you use redux wrapper');
    }
    const wrapperPath = require.resolve('./components/RouterReduxWrapper');
    const wrapper = fs.readFileSync(wrapperPath, 'utf8');
    const configureStorePath = relative(tmpEntryDir, join(dir, config.reduxStore));
    return `
import configureStore from "${configureStorePath}";
${wrapper}
    `;
  }
  const wrapperPath = require.resolve('./components/NormalWrapper');
  return fs.readFileSync(wrapperPath, 'utf8');
}

function createWrapEntry(dir, config) {
  const {entry} = config;
  const tmpEntryDir = wrappedEntryDir(dir);
  mkdirp.sync(tmpEntryDir);
  // add tmpEntry to render xxxx.web.js
  config.tmpEntry = {};
  const wrapper = getWrapper(config, tmpEntryDir, dir);
  for (let key in entry) {
    const entryPath = entry[key];
    const path = relative(tmpEntryDir, join(dir, entryPath));
    const tmpJS = `
import App from "${path}";
${wrapper}
    `;
    const tmpPath = join(tmpEntryDir, entryPath);
    config.tmpEntry[key] = tmpPath;
    fs.writeFileSync(tmpPath, tmpJS, 'utf8');
  }
  return config;
}

export default function build(dir) {
  const config = loadCorenConfig(dir);
  const updatedCorenConfig = createWrapEntry(dir, config);
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
