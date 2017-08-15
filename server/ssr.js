import {resolve, join} from 'path';
import mkdirp from 'mkdirp';
import Promise from 'bluebird';
import App from './app';
import MultiRoutesRenderer from './ssrRenderers/multiRoutes';
import loadCorenConfig from './loadCorenConfig';
import {outputCommonJSDir, assetsJSON, ssrDir, corenBuildDir} from './CONFIG';
const fs = Promise.promisifyAll(require("fs"));

class Entry {
  constructor({entryName, assets, dir, path, config, skipssr = false, env}) {
    this.entryName = entryName;
    this.assets = assets;
    this.dir = dir;
    this.skipssr = skipssr;
    this.config = config;
    this.env = env;
    this.corenBuildDir = corenBuildDir(dir);
    this.ssrDir = ssrDir(dir);
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

    const options = {
      app: this.app,
      plugins: this.config.plugins,
      skipssr: this.skipssr,
      ...this.genAssets(this.assets)
    };

    const ssr = new MultiRoutesRenderer(options);

    // get the array of html result
    ssr.renderToString().then(results => {
      // output file
      return Promise.all(results.map(result => {
        const filepath = join(this.ssrDir, `${result.route}/${this.entryName}.html`);
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
    const assets = this.getAssetsJson();
    for (let key in entry) {
      this.entries.push(new Entry({
        entryName: key,
        assets: assets[key],
        path: resolve(outputCommonJSDir(dir), `${key}.commonjs2.js`),
        config: this.config,
        dir,
        skipssr,
        env
      }));
    }
  }

  getAssetsJson() {
    const data = fs.readFileSync(assetsJSON(this.dir), 'utf8');
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
