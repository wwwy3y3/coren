const {renderToString} = require('react-dom/server');
const {StaticRouter} = require('react-router-dom');
const react = require('react');
const cheerio = require('cheerio');
const {homeRoute} = require('../collectors/routesCollector');

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

    return (routesCollector) ? routesCollector.getRoutes() : [homeRoute];
  }

  // import => prepare => construct => render => html
  async renderToString() {
    // import
    const app = this.app.import();

    await this.app.appWillRender();

    const routes = this.getRoutes();
    const results = [];
    for (let i = 0; i < routes.length; i++) {
      await this.app.routeWillRender(routes[i]);
      const context = {};
      let appElement = react.createElement(StaticRouter, {location: routes[i].path, context},
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

      // insert bundles
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
      results.push({route: routes[i].path, html: $.html()});
    }

    return results;
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
