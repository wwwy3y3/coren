const {isString} = require('lodash');

class ScriptCollector {
  constructor() {
    this.scripts = [];
  }

  ifEnter(component) {
    return component.defineScript;
  }

  componentDidConstruct(id, component, props) {
    const script = component.defineScript(props);
    if (isString(script)) {
      this.scripts.push(script);
    } else {
      // array of scripts
      this.scripts.push(...script);
    }
  }

  routeWillRender() {
    this.scripts = [];
  }

  appendToHead($head) {
    this.scripts.forEach(script => $head.append(`<script src="${script}"></script>`));
  }
}

module.exports = ScriptCollector;
