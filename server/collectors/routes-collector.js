const co = require('co');
const pathToRegexp = require('path-to-regexp');
const {isEmpty, flatten} = require('lodash');
// create a match function
const createMatch = url => (componentUrl, options = {}) => {
  // exact default value is as same as react router default exact
  const exact = options.exact || false;
  const re = pathToRegexp(componentUrl, [], {end: exact});
  return re.exec(url);
};

// uniformed data format
const route = (path, data) => ({path, data, match: createMatch(path)});

// homeRoute default to "/", no data, match would be compare to "/"
const homeRoute = route("/");

class RouterUrl {
  constructor(url) {
    this.url = url;
  }

  getUrls() {
    // why return Promise with array?
    // because RouterParamUrl return Promise with array of urls
    // so we make these two class return same data format
    return Promise.resolve([route(this.url)]);
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
          return route(this.toPath(row), row);
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

  appWillRender() {
    const self = this;
    return co(function * () {
      const urls = yield self.urlPromises;
      self.routes = flatten(urls);
    });
  }

  // default render "/" if empty
  getRoutes() {
    return isEmpty(this.routes) ? [homeRoute] : this.routes;
  }

  wrapClientImport() {
    return `
      import {BrowserRouter as Router} from 'react-router-dom';
    `;
  }

  wrapClientRender($children) {
    return `
      <Router>
        ${$children}
      </Router>
    `;
  }
}

RoutesCollector.homeRoute = homeRoute;
module.exports = RoutesCollector;
