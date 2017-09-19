import {resolve, join} from 'path';
import mkdirp from 'mkdirp';
import Promise from 'bluebird';
import App from './app';
import MultiRoutesRenderer from './ssr-renderers/multi-routes';
import loadCorenConfig from './load-coren-config';
import loadAssetsJSON from './load-assets';
import {getCommonJSDir, getSsrDir} from './coren-working-space';
import {preserveEntry} from './config';

const fs = Promise.promisifyAll(require("fs"));

class Entry {
  constructor({assets, dir, path, config, skipssr = false, env}) {
    this.assets = assets;
    this.dir = dir;
    this.skipssr = skipssr;
    this.config = config;
    this.env = env;
    this.ssrDir = getSsrDir(dir);
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

  genOutputPath(route) {
    let outputPath = `${route}/index.html`;
    if (route === '/') {
      outputPath = 'index.html';
    }
    return join(this.ssrDir, outputPath);
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
        const filepath = this.genOutputPath(result.route);
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
    // vendor file need to put before other assets.
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
