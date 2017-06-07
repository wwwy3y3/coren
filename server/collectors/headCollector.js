
class HeadCollector {
  constructor() {
    this.heads = [];
  }

  ifEnter(component) {
    return component.defineHead;
  }

  componentDidConstruct(id, component, props) {
    this.heads.push(component.defineHead(props));
  }

  appWillRender() {
    this.heads = [];
  }

  getFirstHead() {
    return this.heads[0] || {};
  }

  appendToHead($head) {
    const {title, description} = this.getFirstHead();
    $head.append(`<title>${title}</title>`);
    $head.append(`<meta name="description" content="${description}">`);
  }
}

module.exports = HeadCollector;
