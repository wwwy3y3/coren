import {join} from 'path';
import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';
import {outputAssetDir} from '../CONFIG';

function extractName(key) {
  const ext = path.extname(key);
  let basename = path.basename(key, ext);
  if (ext === '.js') {
    basename = basename.replace('.web', '');
  }
  return {ext, basename};
}

export default class AssetsPath {
  constructor({rootDir}) {
    this.rootDir = rootDir;
    this.distDir = outputAssetDir(rootDir);
  }

  apply(compiler) {
    const assetsPath = {};
    compiler.plugin('after-compile', (compilation, cb) => {
      const assets = compilation.assets;
      const keys = Object.keys(assets);
      keys.forEach(key => {
        if (key !== 'extract-text-webpack-plugin-output-filename') {
          const {ext, basename} = extractName(key);
          let assetsLink = join(this.distDir, key);
          if (!assetsPath[basename]) {
            assetsPath[basename] = {};
          }
          assetsPath[basename][ext] = [assetsLink];
        }
      });
      if (Object.keys(assetsPath).length > 0) {
        const dir = join(this.rootDir, '.coren');
        mkdirp.sync(dir);
        fs.writeFile(join(dir, 'assets.json'), JSON.stringify(assetsPath), function(err) {
          if (err) {
            throw new Error(err);
          }
        });
      }
      cb();
    });
  }
}
