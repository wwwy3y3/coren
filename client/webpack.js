import {resolve} from 'path';
import merge from 'webpack-merge';
import {mapValues, isString} from 'lodash';
import getBabelConfig from '../server/babel/get-babel-config';
import {addClientEntry, createClientTmpEntryFile} from '../server/client-entry';
import loadCorenConfig from '../server/load-coren-config';
import AssetsPathPlugin from '../server/webpack/plugins/assets-path-plugin';
export default class CorenWebpack {
  constructor(dir, userWebpack) {
    this.userWebpack = userWebpack;
    this.corenConfig = loadCorenConfig(dir);
    this.corenConfig = addClientEntry(dir, this.corenConfig);
    createClientTmpEntryFile(dir, this.corenConfig);
    this.mergeEntry();
    this.userWebpack.plugins = [
      new AssetsPathPlugin({rootDir: dir}),
      ...this.userWebpack.plugins
    ];
    this.userWebpack = merge(this.userWebpack, {
      module: {
        rules: [
          {
            test: /\.js$/,
            use: {
              loader: 'babel-loader',
              options: getBabelConfig(dir)
            },
            exclude: resolve(dir, "node_modules")
          }
        ]
      }
    });
  }

  mergeEntry() {
    const userEntry = this.userWebpack.entry;
    if (userEntry) {
      this.userWebpack.entry = mapValues(this.corenConfig.clientEntry, (entry, key) => {
        if (userEntry[key]) {
          entry = isString(entry) ? [entry] : entry;
          return [...userEntry[key], ...entry];
        }
        return entry;
      });
    }
  }

  output() {
    return this.userWebpack;
  }
}
