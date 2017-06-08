# Coren
[![npm Version](https://img.shields.io/npm/v/coren.svg?style=flat-square)](https://www.npmjs.org/package/coren)
[![Build Status](https://travis-ci.org/Canner/coren.svg?branch=master)](https://travis-ci.org/Canner/coren)
## React Pluggable Serverside Render

Is serverside render a big headache for your Single Page App?

say you need head title, description, jsonld, og...

perhaps fetch data from db, then render redux preloadedState

so many things need to be rendered in HTML

### How about we use more flexible way to solve it?

**What if we let component `define` what they need in static method?**

**What if we could fetch database in component?**

`Coren` provide you pluggable, flexible way to render your html

## Table Of Content
- [Features](#features)
- [Installation](#installation)
- [Simple Example](#simple-example)
- [Concepts](#concepts)
    * [Define](#define)
    * [Lifecycle Hook](#lifecycle-hook)
    * [Collector](#collector)
    * [App](#app)
    * [Serverside Renderer](#serverside-renderer)
- [API](#api)
    * [App](#app-1)
    * [Collector](#collector-1)
- [Usage](#usage)
    * [Getting Started](#getting-started)
    * [How to create own Collector](#how-to-create-own-collector)
    * [Example](#example)

# Features
- **:electric_plug:Pluggable:** You can customize your own [collector](#collector) for your own need
- **Access to Component Props:** in [componentDidConstruct](#componentDidConstruct) method from [Lifecycle Hook](#lifecycle-hook) you can access to component props
- **Pass Variables To Component:** [Collector](#collector) can pass anything you want(`DB Query`, `Server API`) to [Define](#define) method

# Installation
``` sh
$ npm install coren --save
```

# Simple Example
Here's a simple example component using collector
``` js
@collector()
export default class Product extends Component {

  // Fetch data first
  // then, during serverside render, put `window.__PRELOADED_STATE__=${state}` to HTML
  static definePreloadedState({db}) {
    return db.fetch('products').exec()
    .then(data => ({about: data}));
  }

  // Put `user ${props.userId}` title tag to HTML
  static defineHead(props) {
    return {
      title: `user ${props.userId}`
    }
  }

  // There are multiple routes I want to render with data from DB
  // [{id: 1}, {id: 2}] should render routes `/product/1` and `/product/2`
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

On Serverside
``` js
const app = new App({
  path: path.resolve(__dirname, 'path/to/app')
});

// HeadCollector get data from `defineHead()`
app.registerCollector("head", new HeadCollector());

// RoutesCollector get routes from `defineRoutes()`
app.registerCollector("routes", new RoutesCollector({
  componentProps: {
    // pass your db instance to component method
    db: mongodb
  }
}));

// ReduxCollector get initialState from `definePreloadedState()`
app.registerCollector("redux", new ReduxCollector({
  componentProps: {
    db
  },
  // reducer of your app
  reducers: reducer
}));

// ssr
const ssr = new MultiRoutesRenderer({app});
ssr.renderToString()
// result: Array<Object({route, html})>
// ex: [{route: "/", html: "..."}, {route: "/users", html: "..."}]
// output html to anywhere you want, filesystem, s3 ...
.then(result => {...})
.catch(err => console.log(err));
```

# Concepts
## Define
`Render` render html base on data gotten from Component.

so, where do Component write what they could provide for Serverside rener?

Component should use `@collector` decorator outside, and use static method, prefixed with `define`. In this case, `@collector` could return data back to server during right lifecycle.


## Lifecycle Hook
We metioned lifecycle above. How does this work?

let us take a look at `collector` decorator
``` js
export default function() {
  return WrappedComponent => {
    const uniqId = shortid.generate();
    /*
      trigger componentDidImport lifecycle here
      notify collectors
    */
    hook.componentDidImport(uniqId, WrappedComponent);
    class Hoc extends React.Component {
      constructor(props) {
        super(props);
        /*
          trigger componentDidConstruct lifecycle here
          pass props to collectors 
        */
        hook.componentDidConstruct(uniqId, WrappedComponent, props);
      }

      render() {
        return <WrappedComponent {...this.props} />;
      }
    }
    return hoistStatic(Hoc, WrappedComponent);
  };
}
```

During serverside render, two lifecycle will be triggered
* `componentDidImport(id, component)`: called when component imported
* `componentDidConstruct(id, component, props)`: called when component constructed

### **Why these two methods?**
In `React-router`, only component matched with route will be rendered. So, component rendered will trigger both methods, on the other hand,  component *not* rendered will trigger only `componentDidImport`. It will help you put right data in your HTML.

For Example, we should only put the `head` tags return from first constructed component. Components that didn't trigger `componentDidConstruct` should not be considered.

## Collector
**What is a `Collector`?**

`Collector` collect data from `define` methods, collector can choose which lifecycle it want to call `define` method.

For example, we take a look at `HeadCollector`, `HeadCollector` call `defineHead(props)` in `componentDidConstruct`, it get `{title, description}`, then push to heads array.

when `serverside renderer` call `appendToHead`, `HeadCollector` push the first head it got from component to `$head`

``` js
class HeadCollector {
  constructor() {
    this.heads = [];
  }

  // ...

  componentDidConstruct(id, component, props) {
    this.heads.push(component.defineHead(props));
  }

  getFirstHead() {
    return this.heads[0] || {};
  }

  // ...

  appendToHead($head) {
    const {title, description} = this.getFirstHead();
    $head.append(`<title>${title}</title>`);
    $head.append(`<meta name="description" content="${description}">`);
  }
}
```

## App
App represent your react application. developer use `App` to register collector
``` js
// create App with path to your React App entry file
const app = new App({
  path: path.resolve(__dirname, 'path/to/app')
});

// register collector
app.registerCollector("head", new HeadCollector());
```

`App` controlls lifecycle of all registered collectors.

Serverside renderer will call `App`'s lifecycle method at certain time, to get the desired result it want.


## Serverside Renderer
The main purpose of Serverside Renderer is to create HTML. By calling `App` to controll lifecycle of collectors, make sure collectors get the result they want.

### Collector Lifecycle
In `MultiRoutesRenderer`, every collector will go through same phases:
1. `componentDidImport(id, component)`: when component imported
2. `appWillRender`: do some async work here if you want to make some api call before render
3. `routeWillRender`: when rendering multiple routes, appWillRender will be called every time the route match with your component and trigger render, so is every method below
4. `wrapElement`: you can wrap your app reactElement if you need a provider outside
5. (app renderToString) => ssrRenderer will call ReactDom.renderToString
6. `componentDidConstruct(id, component, props)`: called when component was constructed
7. `appendToHead($cheerio('head'))`: append any html to head
8. `appendToBody($cheerio('body'))`: append any html to body


# API
## App
### constructor({path: String})
* path: path to your React app entry file
``` js
const app = new App({
  path: path.resolve(__dirname, 'path/to/app')
});
```

### registerCollector(key: String, collector: Collector)
* key: you can directly access to collector by key
``` js
app.getCollector("head")
// return headCollector
```
* collector: the collector you want to register

``` js
app.registerCollector("head", new HeadCollector());
```

## Collector
### ifEnter(component): Boolean
`app` will use `ifEnter` to determine whether call this collector or not

### componentDidImport(id, component): void
called when component imported, when component imported, a unique id attached to it, so you'll know where this component appeared before or not in `componentDidConstruct`.

### componentDidConstruct(id: String, component: ReactComponent, props: Object): void
called when component was constructed

### appWillRender(): Promise
Because we react wont wait for your async code during `import`. So a better way to use async related task is to push your promise to an array, wait for them in `appWillRender`.

Take reduxCollector for example:
``` js
// /src/reduxCollector
componentDidImport(id, component) {
  const promise = component.definePreloadedState(this.componentProps);
  this.queries.push(promise);
}

appWillRender() {
  return Promise.map(this.queries,
    state => Object.assign(this.initialState, state));
}
```

### routeWillRender(): void
In `MultiRoutesRenderer`, you'll have multiple routes to be rendered, so you need a hook to tell your collector when a route is going to be rendered. You can do some reset variable things here.

Take `HeadCollector` for example, we make sure we collect fresh head from component constructed.
``` js
componentDidConstruct(id, component, props) {
  this.heads.push(component.defineHead(props));
}

routeWillRender() {
  // empty heads
  this.heads = [];
}
```

### wrapElement(ReactElement): ReactElement
Some module require developer wrap ReactElement with provider in serverside render.

Take `reduxCollector` for example, we wrap ReactElement with react-redux provider.
``` js
wrapElement(appElement) {
  const store = createStore(this.reducers, this.initialState);
  const wrapedElements = react.createElement(Provider, {store}, appElement);
  this.state = store.getState();
  return wrapedElements;
}
```

### appendToHead($head: cheerio)
append any html to head

### appendToBody($body: cheerio)
append any html to body

# Usage
## Getting Started
1. npm install coren --save
2. use @collector in your component
``` js
import collector from 'coren/lib/client/collectorHoc';

@collector()
export default class UserList extends Component {
  // ...
  render() {
    ...
  }
}
```

3. write `define` method.
``` js
@collector()
export default class UserList extends Component {
  static defineHead() {
    return {
      title: "user list",
      description: "user list"
    };
  }

  static defineRoutes({Url}) {
    return new Url('/users');
  }

  static definePreloadedState({db}) {
    return db.users.find().execAsync()
    .then(list => ({
      users: {
        list,
        fetched: true,
        isFetching: false,
        error: false
      }
    }));
  }
}
```

4. serverside render
serverside render with `app` and `multiRoutesRenderer`
``` js
const db = mongodb;
const app = new App({
  path: path.resolve(__dirname, 'path/to/app')
});

// register collectors
app.registerCollector("head", new HeadCollector());
app.registerCollector("routes", new RoutesCollector({
  componentProps: {
    db
  }
}));
app.registerCollector("redux", new ImmutableReduxCollector({
  componentProps: {
    db
  },
  reducers: reducer
}));

// ssr
const ssr = new MultiRoutesRenderer({
  app,
  // bundle path will be append to html body
  js: ["/bundle.js"]
});

// get the array of html result
ssr.renderToString()
.then(results => {
  return Promise.all(results.map(result => {
    // throw HTML to anywhere you want
    // cached to web server, cache server
    // write to s3, cdn
  }));
})
.catch(err => console.log(err));
```

## How to create own Collector
Write your own class, implement methods in [Collector](#Collector).

Take a look at built-in collector for reference.

https://github.com/Canner/coren/tree/master/server/collectors


## Example
Here's a example repo using this module.
https://github.com/Canner/coren-example
