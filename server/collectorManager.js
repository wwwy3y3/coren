
class CollectorManager {
  constructor() {
    this.componentIds = [];
    this.collectors = [];
    this.collectorsMap = {};
  }

  init({appPath}) {
    this.appPath = appPath;
    this.collectors = [];
    this.collectorsMap = {};
  }

  componentDidImport(id, component) {
    this.collectors.forEach(collector => {
      if (collector.ifEnter(component) && collector.componentDidImport) {
        collector.componentDidImport(component);
      }
    });
  }

  componentDidConstruct(id, component) {
    if (this.componentIds.find(_id => _id === id)) {
      return;
    }

    this.collectors.forEach(collector => {
      if (collector.ifEnter(component) && collector.componentDidConstruct) {
        collector.componentDidConstruct(component);
      }
    });
    this.componentIds.push(id);
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
}

module.exports = CollectorManager;
