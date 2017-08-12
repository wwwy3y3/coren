const {renderToString} = require('react-dom/server');
const {StaticRouter} = require('react-router-dom');
const react = require('react');
const cheerio = require('cheerio');

class MultiRoutesRenderer {
  constructor({app, js = [], css = []}) {
    this.app = app;
    this.js = js;
    this.css = css;
  }

  getRoutes() {
    const routesCollector = this.app.getCollector("routes");
    if (!routesCollector) {
      console.log(`no RoutesCollector found, use "/" to render`);
    }

    return (routesCollector) ? routesCollector.getRoutes() : ["/"];
  }

  // import => prepare => construct => render => html
  renderToString() {
    // import
    const app = this.app.import();

    return this.app.appWillRender()
    .then(() => {
      return this.getRoutes().map(route => {
        this.app.routeWillRender();
        const context = {};
        let appElement = react.createElement(StaticRouter, {location: route, context},
          react.createElement(app));

        // wrapElement
        this.app.collectors.forEach(collector => {
          if (collector.wrapElement) {
            appElement = collector.wrapElement(appElement);
          }
        });

        const markup = renderToString(
          appElement
        );

        const template = createTemplate();
        const $ = cheerio.load(template, {decodeEntities: false});

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
        return {route, html: $.html()};
      });
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

module.exports = MultiRoutesRenderer;
