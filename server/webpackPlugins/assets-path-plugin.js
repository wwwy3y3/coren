import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';
import {outputAssetDir, corenDir, assetsJSON} from '../CONFIG';

export default class AssetsPath {
  constructor({rootDir}) {
    this.rootDir = rootDir;
    this.distDir = outputAssetDir(rootDir);
  }

  apply(compiler) {
    const assetsPath = {};
    compiler.plugin('after-emit', (compilation, cb) => {
      const assets = compilation.assets;
      var stats = compilation.getStats().toJson({
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
        const chunks = assetsByChunkName[entry];
        chunks.forEach(chunk => {
          const ext = path.extname(chunk);
          if (!assetsPath[entry]) {
            assetsPath[entry] = {};
          }
          assetsPath[entry][ext] = [assets[chunk].existsAt];
        });
      }
      mkdirp.sync(corenDir(this.rootDir)); // because plugin would be used by client webpack, need to create dir
      fs.writeFile(assetsJSON(this.rootDir), JSON.stringify(assetsPath), function(err) {
        if (err) {
          throw new Error(err);
        }
        cb();
      });
    });
  }
}
