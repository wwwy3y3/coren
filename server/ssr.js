import {resolve, join, relative} from 'path';
import App from './app';
import MultiRoutesRenderer from './ssrRenderers/multiRoutes';
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

function getPath(route, entryName) {
  return `${route}/${entryName}.html`;
}

class Entry {
  constructor({entryName, assets, dir, path, config}) {
    this.entryName = entryName;
    this.assets = assets;
    this.dir = dir;
    this.publicDir = join(this.dir, '.coren', 'public');
    this.app = new App({path});
    this.config = config;
  }

  registerCollector(context) {
    if (!this.config.registerCollector) {
      return;
    }
    const returnApp = this.config.registerCollector(this.app, {context});
    if (!returnApp instanceof App) {
      throw new Error('You need to return App instance');
    }
    this.app = returnApp;
  }

  render(context) {
    this.registerCollector(context);
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
    this.entries = [];
    const assets = this.getAssetsJson();
    for (let key in entry) {
      this.entries.push(new Entry({entryName: key, assets: assets[key], dir, path: resolve(dir, '.coren', 'dist', `${key}.commonjs2.js`), config: this.config}));
    }
  }

  getAssetsJson() {
    const corenDir = join(this.dir, '.coren');
    const data = fs.readFileSync(join(corenDir, 'assets.json'), 'utf8');
    return JSON.parse(data);
  }

  prepareContext() {
    const {prepareContext} = this.config;
    if (prepareContext) {
      return prepareContext().then(context => {
        this.context = context;
      });
    }
    return new Promise(resolve => resolve());
  }

  render() {
    this.prepareContext().then(() => {
      this.entries.forEach(entry => {
        entry.render(this.context);
      });
    });
  }
}
