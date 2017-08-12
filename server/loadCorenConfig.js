import {resolve} from 'path';
import {existsSync} from 'fs';
import noop from 'noop3';

export const defaultConfig = {
  webpack: null,
  config: [],
  assetsHost: noop
};

export default function loadCorenConfig(dir) {
  const path = resolve(dir, 'coren.config.js');
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

  return config;
}
