const {isString} = require('lodash');

class StyleCollector {
  constructor() {
    this.links = [];
  }

  ifEnter(component) {
    return component.defineStyle;
  }

  componentDidConstruct(id, component, props) {
    const styleLink = component.defineStyle(props);
    if (isString(styleLink)) {
      this.links.push(styleLink);
    } else {
      // array of links
      this.links.push(...styleLink);
    }
  }

  routeWillRender() {
    this.links = [];
  }

  appendToHead($head) {
    this.links.forEach(link => $head.append(`<link rel="stylesheet" href="${link}">`));
  }
}

module.exports = StyleCollector;
