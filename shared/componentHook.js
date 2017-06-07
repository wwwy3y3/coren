
class Hook {
  componentDidImport(id, component) {
    if (this.didImportCallback) {
      this.didImportCallback(id, component);
    }
  }

  bindComponentDidImport(fn) {
    this.didImportCallback = fn;
  }

  componentDidConstruct(id, component, props) {
    if (this.didConstructCallback) {
      this.didConstructCallback(id, component, props);
    }
  }

  bindComponentDidConstruct(fn) {
    this.didConstructCallback = fn;
  }
}

module.exports = new Hook();
