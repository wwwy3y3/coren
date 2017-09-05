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

class RouterParamUrl {
  constructor({url, dataProvider = () => Promise.resolve([])}) {
    this.url = url;
    this.toPath = pathToRegexp.compile(this.url);
    this.dataProvider = dataProvider;
  }

  async getUrls() {
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

export default routeParamsFn => {
  const name = 'routeParams';

  const cycle = {
    name,
    setRoute: async (props, options) => {
      const {url, dataProvider} = routeParamsFn(props, options);
      return await new RouterParamUrl({url, dataProvider}).getUrls();
    }
  };

  return WrappedComponent => {
    hook.bindMethod(WrappedComponent.__COREN_ID(), cycle);
  };
};
