class Hook {
  constructor() {
    this.components = {};
    this.methods = {};
    this.props = {};
  }

  registerComponent(corenID, component) {
    this.components[corenID] = component;
  }

  setProps(id, props) {
    this.props[id] = props;
  }

  bindMethod(id, cycle) {
    if (!this.methods[id]) {
      this.methods[id] = [];
    }
    this.methods[id].push(cycle);
  }
}

module.exports = new Hook();
