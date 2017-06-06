
class HeadCollector {
  constructor() {
    this.heads = [];
  }

  ifEnter(component) {
    return component.defineHead;
  }

  componentDidConstruct(component) {
    console.log("componentDidConstruct");
    this.heads.push(component.defineHead());
  }

  componentWillRender() {
    console.log("reset");
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
