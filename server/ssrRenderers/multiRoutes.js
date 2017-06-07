const {renderToString} = require('react-dom/server');
const {StaticRouter} = require('react-router-dom');
const react = require('react');
const cheerio = require('cheerio');

class MultiRoutesRenderer {
  constructor({collectorManager, js = [], css = []}) {
    this.collectorManager = collectorManager;
    this.js = js;
    this.css = css;
  }

  getRoutes() {
    const routesCollector = this.collectorManager.getCollector("routes");
    if (!routesCollector) {
      console.log(`no RoutesCollector found, use "/" to render`);
    }

    return (routesCollector) ? routesCollector.getRoutes() : ["/"];
  }

  // import => prepare => construct => render => html
  renderToString() {
    // import
    const app = this.collectorManager.importApp();

    return this.collectorManager.prepare()
    .then(() => {
      return this.getRoutes().map(route => {
        this.collectorManager.appWillRender();
        const context = {};
        let appElement = react.createElement(StaticRouter, {location: route, context},
          react.createElement(app));

        // wrapApp
        this.collectorManager.collectors.forEach(collector => {
          if (collector.wrapApp) {
            appElement = collector.wrapApp(appElement);
          }
        });

        const markup = renderToString(
          appElement
        );

        const template = createTemplate();
        const $ = cheerio.load(template, {decodeEntities: false});

        // insert bundles
        this.js.forEach(bundle => $('head').append(`<script src="${bundle}"></script>`));

        // insert css
        this.css.forEach(link => $('head').append(`<link rel="stylesheet" href="${link}">`));

        // insert rendered html
        $('#root').html(markup);

        // insert collectors' head and body
        this.collectorManager.collectors.forEach(collector => {
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
