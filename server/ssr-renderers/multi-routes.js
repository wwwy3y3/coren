import {renderToString} from 'react-dom/server';
import react from 'react';
import cheerio from 'cheerio';

class MultiRoutesRenderer {
  constructor({app, js = [], css = [], plugins = [], skipssr, context}) {
    this.app = app;
    this.js = js;
    this.css = css;
    this.plugins = plugins;
    this.skipssr = skipssr;
    this.context = context;
  }

  triggerPluginsLifecycle(lifecycle, props) {
    this.plugins.forEach(plugin => {
      if (plugin[lifecycle]) {
        plugin[lifecycle](props);
      }
    });
  }

  collectLifeCycleMethod(method) {
    const collected = {
      setOptions: [],
      appendToHead: [],
      appendToBody: [],
      wrapSSR: []
    };
    method.forEach(m => {
      for (let key in collected) {
        if (m[key]) {
          collected[key].push(m[key]);
        }
      }
    });
    return collected;
  }

  async getRoutes(componentMethod, props) {
    let routes = [];
    for (let method of componentMethod) {
      if (method.setRoute) {
        const methodRoute = await method.setRoute(props, this.context);
        routes = [...routes, ...methodRoute];
      }
    }
    return routes;
  }

  // import => prepare => construct => render => html
  async renderToString() {
    // import
    const app = this.app.import();
    const components = this.app.getComponents();
    const methods = this.app.getMethod();
    const componentProps = this.app.getProps();

    const results = [];

    for (let corenID in components) {
      const props = componentProps[corenID];
      const collectedMethod = this.collectLifeCycleMethod(methods[corenID]);
      // get routes
      const routes = await this.getRoutes(methods[corenID], props);
      for (let i = 0; i < routes.length; i++) {
        const route = routes[i];
        const template = createTemplate();
        const $ = cheerio.load(template, {decodeEntities: false});
        const $head = $('head');
        const $body = $('body');
        let appElement = react.createElement(app);
        let options = {route, context: this.context};

        // run lifecycle method
        for (let fn of collectedMethod.setOptions) {
          options = Object.assign({}, options, await fn(props, options));
        }

        collectedMethod.wrapSSR.forEach(fn => {
          appElement = fn(appElement, options);
        });
        collectedMethod.appendToHead.forEach(fn => fn($head, options));
        collectedMethod.appendToBody.forEach(fn => fn($body, options));

        const markup = renderToString(appElement);

        // plugin lifecycle: appDidRender
        this.triggerPluginsLifecycle('appDidRender', {$head, $body});

        // insert bundles
        this.js.forEach(bundle => {
          $('body').append(`<script src="${bundle}"></script>`);
          // plugin lifecycle: jsDidAppend
          this.triggerPluginsLifecycle('jsDidAppend', {link: bundle, $head, $body});
        });

        // insert css
        this.css.forEach(link => {
          $('head').append(`<link rel="stylesheet" href="${link}">`);
          // plugin lifecycle: cssDidAppend
          this.triggerPluginsLifecycle('cssDidAppend', {link, $head, $body});
        });

        // insert rendered html
        $('#root').html(this.skipssr ? '' : markup);
        results.push({route: routes[i].path, html: $.html()});
      }
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
