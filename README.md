# render
React Pluggable Serverside Render

use Collectors to collect data from `define` methods in component

head title, description, jsonld, og, redux preloadedState... anything you want, and render them to your html

## requirements
* react router v4

## example
https://github.com/Canner/render-example

## usage
### 1. Component using `define` method
``` js
@collector()
export default class Product extends Component {

  // I want to fetch data and render to PRELOADED_STATE in redux
  static definePreloadedState({db}) {
    return db.fetch('products').exec()
    .then(data => ({about: data}));
  }

  // I want to define my title with userId prop from component
  static defineHead(props) {
    return {
      title: `user ${props.userId}`
    }
  }

  // I want to render routes /product/:id with data I fetch from DB
  static defineRoutes({ParamUrl, db}) {
    return new ParamUrl({
      url: '/products/:id',
      dataProvider: () => db.fetch('products').exec()
    });
  }

  render() {
    return <div>
      ...
    </div>;
  }
}
```

### 2. Collector collect
every collector will go through same phases:
* `componentDidImport(id, component)`: when component imported
* `prepare`: do some async work here if you want to make some api call before render
* `appWillRender`: when rendering multiple routes, appWillRender will be called every time the route match with your component and trigger render, so is every method below
* `wrapApp`: you can wrap your app reactElement if you need a provider outside
* (app renderToString) => ssrRenderer will call ReactDom.renderToString
* `componentDidConstruct(id, component, props)`: called when component was constructed
* `appendToHead($cheerio('head'))`: append any html to head
* `appendToBody($cheerio('body'))`: append any html to body
#### take redux colllector for example
``` js
class ReduxCollector {
  constructor({componentProps, reducers}) {
    this.queries = [];
    this.initialState = {};
    this.componentProps = componentProps;
    this.reducers = reducers;
  }

  // if component have `definePreloadedState` method, continue
  ifEnter(component) {
    return component.definePreloadedState;
  }

  // if component was imported, this method will be called
  // every component import, will be assigned with a unique id
  componentDidImport(id, component) {
    const promise = component.definePreloadedState(this.componentProps);
    this.queries.push(promise);
  }

  // waiting queries done
  prepare() {
    return Promise.map(this.queries,
      state => Object.assign(this.initialState, state));
  }

  // redux serverside render need appElement wrapped with redux provider
  // get state from store
  wrapApp(appElement) {
    const store = createStore(this.reducers, this.initialState);
    const wrapedElements = react.createElement(Provider, {store}, appElement);
    this.state = store.getState();
    return wrapedElements;
  }

  // append state to window.__PRELOADED_STATE__ in head
  appendToHead($head) {
    $head.append(`<script>
      window.__PRELOADED_STATE__ = ${JSON.stringify(this.state)}
      </script>`);
  }
}
```

### 3. Serverside render
``` js
const collectorManager = new CollectorManager({
  appPath: path.resolve(__dirname, 'path/to/app')
});

// HeadCollector will collect data from `defineHead()`
collectorManager.registerCollector("head", new HeadCollector());

// RoutesCollector will collect routes from `defineRoutes()`
collectorManager.registerCollector("routes", new RoutesCollector({
  componentProps: {
    // pass your db instance to component method
    db: mongodb
  }
}));

// ReduxCollector will collect initialState from `definePreloadedState()`
collectorManager.registerCollector("redux", new ReduxCollector({
  componentProps: {
    db
  },
  // reducer of your app
  reducers: reducer
}));

// ssr
const ssr = new MultiRoutesRenderer({collectorManager});
ssr.renderToString()
// result: Array<Object({route, html})>
// ex: [{route: "/", html: "..."}, {route: "/users", html: "..."}]
// output html to anywhere you want, filesystem, s3 ...
.then(result => {...})
.catch(err => console.log(err));
```
