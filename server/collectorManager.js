const hook = require('../shared/componentHook');

class CollectorManager {
  constructor({appPath}) {
    this.collectors = [];
    this.collectorsMap = {};
    this.appPath = appPath;
    hook.bindComponentDidImport(this.componentDidImport.bind(this));
    hook.bindComponentDidConstruct(this.componentDidConstruct.bind(this));
  }

  componentDidImport(id, component) {
    this.collectors.forEach(collector => {
      if (collector.ifEnter(component) && collector.componentDidImport) {
        collector.componentDidImport(id, component);
      }
    });
  }

  componentDidConstruct(id, component, props) {
    this.collectors.forEach(collector => {
      if (collector.ifEnter(component) && collector.componentDidConstruct) {
        collector.componentDidConstruct(id, component, props);
      }
    });
  }

  appWillRender() {
    this.collectors.forEach(collector => {
      if (collector.appWillRender) {
        collector.appWillRender();
      }
    });
  }

  registerCollector(key, collector) {
    this.collectors.push(collector);
    this.collectorsMap[key] = collector;
  }

  getCollector(key) {
    return this.collectorsMap[key];
  }

  importApp() {
    return require(this.appPath);
  }

  prepare() {
    return Promise.all(this.collectors.map(collector =>
      collector.prepare ? collector.prepare() : Promise.resolve()));
  }
}

module.exports = CollectorManager;
