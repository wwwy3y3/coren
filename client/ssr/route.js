import hook from '../../shared/ssrHook';
const pathToRegexp = require('path-to-regexp');

// create a match function
const createMatch = url => (componentUrl, options = {}) => {
  // exact default value is as same as react router default exact
  const exact = options.exact || false;
  const re = pathToRegexp(componentUrl, [], {end: exact});
  return re.exec(url);
};

const route = (path, data) => ({path, data, match: createMatch(path)});

const homeRoute = route("/");

class RouterUrl {
  constructor(url) {
    this.url = url;
  }

  getUrls() {
    // why return Promise with array?
    // because RouterParamUrl return Promise with array of urls
    // so we make these two class return same data format
    return [route(this.url)];
  }
}

// export {homeRoute};

const routeFn = function(route) {
  const name = 'route';

  const cycle = {
    name,
    setRoute: () => {
      return new RouterUrl(route).getUrls();
    }
  };

  return WrappedComponent => {
    hook.bindMethod(WrappedComponent.__COREN_ID(), cycle);
  };
};

exports.homeRoute = homeRoute;
module.exports = routeFn;
