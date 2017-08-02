import {join} from 'path';
import {existsSync} from 'fs';

export const defaultConfig = {
  webpack: null
};

export default function loadCorenConfig(dir) {
  const path = join(dir, 'coren.config.js');
  let config = defaultConfig;
  const hasConfig = existsSync(path);
  if (hasConfig) {
    const userConfig = require(path);
    if (!userConfig.entry) {
      throw new Error('Cannot find `entry` in coren.config.js');
    }
    config = Object.assign({}, config, userConfig);
  } else {
    throw new Error('You need to provide coren.config.js');
  }
  config.wrapper = config.wrapper || [];
  return config;
}
