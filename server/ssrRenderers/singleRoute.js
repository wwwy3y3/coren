const {renderToString} = require('react-dom/server');
const {StaticRouter} = require('react-router-dom');
const react = require('react');
const cheerio = require('cheerio');

class SingleRouteRenderer {
  constructor({route = '/', collectorManager, bundles = []}) {
    this.route = route;
    this.collectorManager = collectorManager;
    this.bundles = bundles;
  }

  // import => prepare => construct => render => html
  renderToString() {
    const app = this.collectorManager.importApp();
    const context = {};
    let appElement = react.createElement(StaticRouter, {location: this.route, context},
        react.createElement(app));

    return this.collectorManager.prepare()
    .then(() => {
      // wrapApp
      this.collectorManager.collectors.forEach(collector => {
        if (collector.wrapApp) {
          appElement = collector.wrapApp(appElement);
        }
      });

      // ssr
      // trigger componentDidConstruct in collectors
      const markup = renderToString(
        appElement
      );

      const template = createTemplate();
      const $ = cheerio.load(template, {decodeEntities: false});
      // insert bundles
      this.bundles.forEach(bundle => $('head').append(`<script src="${bundle}"></script>`));

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
