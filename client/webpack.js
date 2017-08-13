import {addClientEntry, createClientTmpEntryFile} from '../server/clientEntry';
import loadCorenConfig from '../server/loadCorenConfig';
import AssetsPathPlugin from '../server/webpackPlugins/assets-path-plugin';

export default class CorenWebpack {
  constructor(dir, userWebpack) {
    let corenConfig = loadCorenConfig(dir);
    corenConfig = addClientEntry(dir, corenConfig);
    createClientTmpEntryFile(dir, corenConfig);
    userWebpack.entry = corenConfig.clientEntry;
    userWebpack.plugins = [
      new AssetsPathPlugin({rootDir: dir}),
      ...userWebpack.plugins
    ];
    this.webpack = userWebpack;
  }

  output() {
    return this.webpack;
  }
}
