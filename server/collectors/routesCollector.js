const co = require('co');
const pathToRegexp = require('path-to-regexp');
const {isEmpty, flatten} = require('lodash');

class RouterUrl {
  constructor(url) {
    this.url = url;
  }

  getUrls() {
    // why return Promise with array?
    // because RouterParamUrl return Promise with array of urls
    // so we make these two class return same data format
    return Promise.resolve([this.url]);
  }
}

class RouterParamUrl {
  constructor({url, dataProvider = () => Promise.resolve([])}) {
    this.url = url;
    this.toPath = pathToRegexp.compile(this.url);
    this.dataProvider = dataProvider;
  }

  getUrls() {
    return this.dataProvider()
    .then(data => {
      return data.map(row => {
        try {
          return this.toPath(row);
        } catch (err) {
          // row not pass toPath, will throw TypeError
          // https://github.com/pillarjs/path-to-regexp#compile-reverse-path-to-regexp
          if (err instanceof TypeError) {
            return null;
          }

          // another error, throw
          throw err;
        }
      })
      // filter null
      .filter(row => row);
    });
  }
}

class RoutesCollector {
  constructor({componentProps}) {
    // urls collected from component, RouterUrl or RouterParamUrl
    this.urlPromises = [];
    // routes generated in prepare from this.urls
    this.routes = [];
    this.componentProps = componentProps;
  }

  ifEnter(component) {
    return component.defineRoutes;
  }

  componentDidImport(id, component) {
    const props = Object.assign({}, this.componentProps, {Url: RouterUrl, ParamUrl: RouterParamUrl});
    this.urlPromises.push(component.defineRoutes(props).getUrls());
  }

  prepare() {
    const self = this;
    return co(function * () {
      const urls = yield self.urlPromises;
      self.routes = flatten(urls);
    });
  }

  // default render "/" if empty
  getRoutes() {
    return isEmpty(this.routes) ? ["/"] : this.routes;
  }
}

module.exports = RoutesCollector;
