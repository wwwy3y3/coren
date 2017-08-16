import findBabelrc from './find-babelrc';
import defaultBabelrc from './default-babelrc';

// if user has babelrc file, it would cover default babelrc config
export default function(dir) {
  const customBabelrc = findBabelrc(dir);
  const returnBabelrc = {};
  if (customBabelrc) {
    returnBabelrc.babelrc = true;
  } else {
    returnBabelrc.babelrc = false;
  }

  if (!returnBabelrc.babelrc) {
    returnBabelrc.presets = defaultBabelrc.presets;
    returnBabelrc.plugins = defaultBabelrc.plugins;
  }
  return returnBabelrc;
}
