import {resolve, join} from 'path';
import mkdirp from 'mkdirp';
import Promise from 'bluebird';
import App from './app';
import MultiRoutesRenderer from './ssr-renderers/multi-routes';
import loadCorenConfig from './load-coren-config';
import loadAssetsJSON from './load-assets';
import {getCommonJSDir, preserveEntry, getSsrDir} from './coren-working-space';
const fs = Promise.promisifyAll(require("fs"));

class Entry {
  constructor({entryName, assets, dir, path, config, skipssr = false, env}) {
    this.entryName = entryName;
    this.assets = assets;
    this.dir = dir;
    this.skipssr = skipssr;
    this.config = config;
    this.env = env;
    this.getSsrDir = getSsrDir(dir);
    this.app = new App({path});
  }

  genAssets() {
    const assets = {js: [], css: []};
    if (this.assets['.js']) {
      this.assets['.js'].forEach(js => {
        assets.js.push(this.assetRelative(js));
      });
    }
    if (this.assets['.css']) {
      this.assets['.css'].forEach(css => {
        assets.css.push(this.assetRelative(css));
      });
    }
    return assets;
  }

  assetRelative(absolutePath) {
    return this.config.assetsHost(this.env, absolutePath);
  }

  render(context) {
    const {js, css} = this.genAssets();
    const options = {
      app: this.app,
      plugins: this.config.plugins,
      skipssr: this.skipssr,
      context,
      js,
      css
    };

    const ssr = new MultiRoutesRenderer(options);

    // get the array of html result
    return ssr.renderToString().then(results => {
      // output file
      return Promise.all(results.map(result => {
        const filepath = join(this.getSsrDir, `${result.route}/${this.entryName}.html`);
        mkdirp.sync(resolve(filepath, "../"));
        // write to filesystem
        return fs.writeFileAsync(filepath, result.html);
      }));
    })
    .catch(err => console.log(err));
  }
}

export default class ssr {
  constructor({dir, skipssr, env}) {
    this.dir = dir;
    this.config = loadCorenConfig(dir);
    const {entry} = this.config;
    this.entries = [];
    const assets = loadAssetsJSON(dir);
    for (let key in entry) {
      if (!preserveEntry.includes(key)) {
        this.entries.push(new Entry({
          entryName: key,
          assets: this.generateEntryAssets(assets, key),
          path: resolve(getCommonJSDir(dir), `${key}.commonjs2.js`),
          config: this.config,
          dir,
          skipssr,
          env
        }));
      }
    }
  }

  // merge the preserve assets key with app's assets
  generateEntryAssets(assets, entry) {
    const entryAsset = assets[entry];
    if (assets.$vendor) {
      ['.js', '.css'].forEach(ext => {
        if (assets.$vendor[ext]) {
          if (!entryAsset[ext]) {
            entryAsset[ext] = [];
          }
          entryAsset[ext] = [
            ...assets.$vendor[ext],
            ...entryAsset[ext]
          ];
        }
      });
    }
    return entryAsset;
  }

  prepareContext() {
    const {prepareContext} = this.config;
    if (prepareContext) {
      return prepareContext().then(context => {
        this.context = context;
      });
    }
    return Promise.resolve();
  }

  render() {
    return this.prepareContext().then(() => {
      return Promise.all(this.entries.map(entry => entry.render(this.context)));
    });
  }
}
