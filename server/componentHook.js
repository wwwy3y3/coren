
class Hook {
  componentDidImport(id, component) {
    if (this.didImportCallback) {
      this.didImportCallback(id, component);
    }
  }

  bindComponentDidImport(fn) {
    this.didImportCallback = fn;
  }

  componentDidConstruct(id, component) {
    if (this.didConstructCallback) {
      this.didConstructCallback(id, component);
    }
  }

  bindComponentDidConstruct(fn) {
    this.didConstructCallback = fn;
  }
}

module.exports = new Hook();
