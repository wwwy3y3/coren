import {addClientEntry, createClientTmpEntryFile} from '../server/client-entry';
import loadCorenConfig from '../server/load-coren-config';
import AssetsPathPlugin from '../server/webpack/plugins/assets-path-plugin';
import {mapValues} from 'lodash';
export default class CorenWebpack {
  constructor(dir, appendEntry, userWebpack) {
    let corenConfig = loadCorenConfig(dir);
    corenConfig = addClientEntry(dir, corenConfig);
    createClientTmpEntryFile(dir, corenConfig);
    const clientEntry = mapValues(corenConfig.clientEntry, i => [...appendEntry(), i]);
    userWebpack.entry = clientEntry;
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
