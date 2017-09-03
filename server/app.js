const hook = require('../shared/ssrHook');

class App {
  constructor({path}) {
    this.collectors = [];
    this.collectorsMap = {};
    this.path = path;
  }

  import() {
    return require(this.path);
  }

  getMethod() {
    return hook.methods;
  }

  getComponents() {
    return hook.components;
  }

  getProps() {
    return hook.props;
  }
}

module.exports = App;
