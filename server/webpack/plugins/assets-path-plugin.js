import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';
import {getRootPath, getAssetsJsonPath} from '../../coren-working-space';
import {isString} from 'lodash';

let emited = false;

export default class AssetsPath {
  constructor({rootDir}) {
    this.rootDir = rootDir;
  }

  apply(compiler) {
    const assetsPath = {};
    compiler.plugin('after-emit', (compilation, cb) => {
      if (emited) {
        cb();
      } else {
        const assets = compilation.assets;
        const stats = compilation.getStats().toJson({
          hash: true,
          publicPath: true,
          assets: true,
          chunks: false,
          modules: false,
          source: false,
          errorDetails: false,
          timings: false
        });
        const assetsByChunkName = stats.assetsByChunkName;
        for (let entry in assetsByChunkName) {
          let chunks = assetsByChunkName[entry];
          chunks = isString(chunks) ? [chunks] : chunks;
          chunks.forEach(chunk => {
            const ext = path.extname(chunk);
            if (!assetsPath[entry]) {
              assetsPath[entry] = {};
            }
            assetsPath[entry][ext] = [assets[chunk].existsAt];
          });
        }
        mkdirp.sync(getRootPath(this.rootDir)); // because plugin would be used by client webpack, need to create dir
        emited = true;
        fs.writeFile(getAssetsJsonPath(this.rootDir), JSON.stringify(assetsPath), function(err) {
          if (err) {
            throw new Error(err);
          }
          cb();
        });
      }
    });
  }
}
