import {resolve, join, relative} from 'path';
import {
  App,
  MultiRoutesRenderer,
  HeadCollector,
  RoutesCollector
} from 'coren';
import mkdirp from 'mkdirp';
import Promise from 'bluebird';
import loadCorenConfig from './loadCorenConfig';
const fs = Promise.promisifyAll(require("fs"));

function assetToRelativePath(assets, publicDir) {
  assets = assets.map(asset => {
    return relative(publicDir, asset);
  });
  return assets;
}

class SsrApp {
  constructor({entryName, assets, dir, path, config}) {
    this.entryName = entryName;
    this.assets = assets;
    this.dir = dir;
    this.publicDir = join(this.dir, '.coren', 'public');
    this.app = new App({path});
    this.config = config;
  }

  registerCollector(db) {
    this.app.registerCollector("head", new HeadCollector());
    this.app.registerCollector("routes", new RoutesCollector({
      componentProps: {db}
    }));
    this.registerCustomCollector(db);
  }

  registerCustomCollector(db) {
    if (!this.config.customCollector) {
      return;
    }
    const returnApp = this.config.customCollector(this.app, {db});
    if (!returnApp instanceof App) {
      throw new Error('You need to return App instance');
    }
    this.app = returnApp;
  }

  render(db) {
    this.registerCollector(db);
    const options = {app: this.app, js: [assetToRelativePath(this.assets['.js'], this.publicDir)]};
    if (this.assets['.css']) {
      options.css = [assetToRelativePath(this.assets['.css'], this.publicDir)];
    }
    const ssr = new MultiRoutesRenderer(options);
    // get the array of html result
    ssr.renderToString()
    .then(results => {
      return Promise.all(results.map(result => {
        const filepath = join(this.publicDir, getPath(result.route, this.entryName));
        mkdirp.sync(resolve(filepath, "../"));

        // write to filesystem
        return fs.writeFileAsync(filepath, result.html);
      }));
    })
    .catch(err => console.log(err));
  }
}

export default class ssr {
  constructor(dir) {
    this.dir = dir;
    this.config = loadCorenConfig(dir);
    const {entry} = this.config;
    this.apps = [];
    const assets = this.getAssetsJson();
    for (let key in entry) {
      this.apps.push(new SsrApp({entryName: key, assets: assets[key], dir, path: resolve(dir, '.coren', 'dist', `${key}.commonjs2.js`), config: this.config}));
    }
  }

  getAssetsJson() {
    const corenDir = join(this.dir, '.coren');
    const data = fs.readFileSync(join(corenDir, 'assets.json'), 'utf8');
    return JSON.parse(data);
  }

  fetchDB() {
    const {getDB} = this.config;
    if (getDB) {
      return getDB().then(db => {
        this.db = db;
      });
    }
    return new Promise(resolve => resolve());
  }

  render() {
    this.fetchDB().then(() => {
      this.apps.forEach(app => {
        app.render(this.db);
      });
    });
  }
}

function getPath(route, entryName) {
  return `${route}/${entryName}.html`;
}
