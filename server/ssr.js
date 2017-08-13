import {resolve, join, relative} from 'path';
import Promise from 'bluebird';
import App from './app';
import MultiRoutesRenderer from './ssrRenderers/multiRoutes';
import loadCorenConfig from './loadCorenConfig';
import {outputCommonJSDir, assetsJSON, ssrDir, corenBuildDir} from './CONFIG';
const fs = Promise.promisifyAll(require("fs"));

function ssrAssetsPath(assets, buildDir) {
  return assets.map(asset => {
    return `/${relative(buildDir, asset)}`;
  });
}

function getPath(route, entryName) {
  return `${route}/${entryName}.html`;
}

class Entry {
  constructor({entryName, assets, dir, path, config}) {
    this.entryName = entryName;
    this.assets = assets;
    this.dir = dir;
    this.corenBuildDir = corenBuildDir(dir);
    this.ssrDir = ssrDir(dir);
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
    const options = {
      app: this.app,
      js: [ssrAssetsPath(this.assets['.js'], this.publicDir)],
      plugins: this.config.plugins
    };

    if (this.assets['.css']) {
      options.css = [ssrAssetsPath(this.assets['.css'], this.corenBuildDir)];
    }

    const ssr = new MultiRoutesRenderer(options);
    // get the array of html result
    ssr.renderToString()
    .then(results => {
      return Promise.all(results.map(result => {
        const filepath = join(this.ssrDir, getPath(result.route, this.entryName));

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
      this.entries.push(new Entry({entryName: key, assets: assets[key], dir, path: resolve(outputCommonJSDir(dir), `${key}.commonjs2.js`), config: this.config}));
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
