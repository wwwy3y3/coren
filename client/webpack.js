import {resolve} from 'path';
import merge from 'webpack-merge';
import {mapValues, isString} from 'lodash';
import getBabelConfig from '../server/babel/get-babel-config';
import loadCorenConfig from '../server/load-coren-config';
import AssetsPathPlugin from '../server/webpack/plugins/assets-path-plugin';
export default class CorenWebpack {
  constructor(dir, userWebpack) {
    this.userWebpack = userWebpack;
    this.corenConfig = loadCorenConfig(dir);
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
    } else {
      this.userWebpack.entry = this.corenConfig.clientEntry;
    }
  }

  output() {
    return this.userWebpack;
  }
}
