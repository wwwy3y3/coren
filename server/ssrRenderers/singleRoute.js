const {renderToString} = require('react-dom/server');
const {StaticRouter} = require('react-router-dom');
const react = require('react');
const cheerio = require('cheerio');

class SingleRouteRenderer {
  constructor({route = '/', app, js = [], css = []}) {
    this.route = route;
    this.app = app;
    this.js = js;
    this.css = css;
  }

  // import => appWillRender => routeWillRender => wrapElement => (render) => construct => html
  renderToString() {
    const app = this.app.import();
    const context = {};
    let appElement = react.createElement(StaticRouter, {location: this.route, context},
        react.createElement(app));

    return this.app.appWillRender()
    .then(() => {
      // route will render
      this.app.routeWillRender();
      // wrapElement
      this.app.collectors.forEach(collector => {
        if (collector.wrapElement) {
          appElement = collector.wrapElement(appElement);
        }
      });

      // ssr
      // trigger componentDidConstruct in collectors
      const markup = renderToString(
        appElement
      );

      const template = createTemplate();
      const $ = cheerio.load(template, {decodeEntities: false});
      // insert js
      this.js.forEach(bundle => $('body').append(`<script src="${bundle}"></script>`));

      // insert css
      this.css.forEach(link => $('head').append(`<link rel="stylesheet" href="${link}">`));

      // insert rendered html
      $('#root').html(markup);

      // insert collectors' head and body
      this.app.collectors.forEach(collector => {
        if (collector.appendToHead) {
          collector.appendToHead($('head'));
        }

        if (collector.appendToBody) {
          collector.appendToBody($('body'));
        }
      });
      return $.html();
    });
  }
}

function createTemplate() {
  return `
  <!doctype html>
  <html>
  <head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body><div id="root"></div></body>
  </html>
  `;
}

module.exports = SingleRouteRenderer;
