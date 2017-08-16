import {join, resolve} from 'path';
import buildConfigChain from 'babel-core/lib/transformation/file/options/build-config-chain';

// ref: https://github.com/zeit/next.js/blob/v3-beta/server/build/babel/find-config.js
export default function findBabelConfig(dir) {
  dir = resolve(dir);
  const filename = join(dir, 'filename.js');
  const options = {babelrc: true, filename};

  const configList = buildConfigChain(options).filter(i => i.loc !== 'base');

  // To prevent get the root babelrc config, only use the build folder's babelrc
  if (configList[0] && configList[0].dirname === dir) {
    return configList[0];
  }
  return false;
}
