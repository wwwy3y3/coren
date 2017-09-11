# Coren

> React offline server-rendered framework

[![npm Version](https://img.shields.io/npm/v/coren.svg?style=flat-square)](https://www.npmjs.org/package/coren)[](https://travis-ci.org/Canner/coren)
![Build Status](https://travis-ci.org/Canner/coren.svg?branch=master)

# Features

- **:no_mobile_phones: Offline** ssr solution: your server will not include any react related code but still can do ssr.
- **:wrench: Access to Component Props:** in [componentDidConstruct](#componentDidConstruct) method from [Lifecycle Hook](#lifecycle-hook) you can access to component props
- **:link: Pass Variables To Component:** [Collector](#collector) can pass anything you want(`DB Query`, `Server API`) to [Define](#define) method
- **:cloud: Production stage** ssr: just run coren before deploy code

## React Pluggable Serverside Render

Is serverside render a big headache for your Applications?  You need to setup various kinds of settings such as title, description, jsonld, og, maybe fetch data from your database... etc. So here comes **Coren**!

### How about we use more flexible way to solve it?

The central idea of **Coren** is to provide a pluggable, and more flexible way to **define** server-side methods in your components.

**And say goodbye to all your html template engines**

## Table Of Content

<!-- toc -->

- [How to use?](#how-to-use)
  * [Setup a new project](#setup-a-new-project)
- [Documentation](#documentation)
    + [coren.config.js](#corenconfigjs)
      - [entry](#entry)
      - [webpack](#webpack)
      - [registerCollector](#registercollector)
      - [prepareContext](#preparecontext)
      - [assetsHost](#assetshost)
    + [webpack configuration](#webpack-configuration)
    + [express](#express)
  * [Start the project](#start-the-project)
      - [development](#development)
      - [production](#production)
  * [Collector](#collector)
      - [HeadCollector](#headcollector)
        * [coren.config.js](#corenconfigjs-1)
        * [app](#app)
      - [RouteCollector](#routecollector)
        * [coren.config.js](#corenconfigjs-2)
        * [app](#app-1)
      - [ReduxCollector](#reduxcollector)
        * [app](#app-2)
    + [How to create own Collector](#how-to-create-own-collector)
  * [Express Integration - coren middleware](#express-integration---coren-middleware)
    + [API](#api)
      - [res.setHead(Function($head: cheerio instance))](#ressetheadfunctionhead-cheerio-instance)
      - [res.setPreloadedState(Object)](#ressetpreloadedstateobject)
      - [res.sendCoren(`entry`)](#ressendcorenentry)
  * [Integrate with current project](#integrate-with-current-project)
- [Limitation](#limitation)
- [More Example](#more-example)
- [中文簡介](#%E4%B8%AD%E6%96%87%E7%B0%A1%E4%BB%8B)
- [License](#license)

<!-- tocstop -->

# How to use?

## Setup a new project

First, clone [coren-starter-kit](https://github.com/Canner/coren-starter-kit).

In this starter-kit, you can find it's not so much different from other react boilerplate.

So we are going to explain the different part of coren projects. At this brief introduction, we will not elaborate on each term. But don't worry, you can see more details document after this part.

First take a look at `coren.config.js`.

**@coren-starter-kit/coren.config.js**
```js
module.exports = {
  entry: {
    index: './src/components/Index.js'
  },
  assetsHost: (env, absolutePath = '') => {
    const rel = path.relative(`${__dirname}/dist/`, absolutePath);
    switch (env) {
      case 'production':
        return `/dist/${rel}`;
      case 'development':
      case 'pre-production':
        return `http://localhost:9393/dist/${rel}`;
      default:
        return false;
    }
  }
};
```

`coren.config.js` is config file to make coren run correctly.

* **`entry`** is the component you want to do server sider render.

* **`assetsHost`** is used to generate the static file link in different building environment.

Then open `./src/components/Index.js`.

**@coren-starter-kit/src/components/Index.js**
```js
import React, {Component} from 'react';
import {head, ssr, route} from 'coren';
import './style.css';

@route('/')
@head({title: 'Home', description: 'home description'})
@ssr
export default class Index extends Component {
  render() {
    return (
      <h1 className="hello">Hello coren!!</h1>
    );
  }
}
```

Coren use `decorator` to wrap component to make server side render work. This component is wrapped by `@ssr`, `@head`, `@route`.<br/>With these decorator, coren will do server side render at this component, append `<title>Home</title><meta name="description" content="home description">` at `<head/>`, and use `/` route.
<br/>So that is how coren work. We use decorator to control the server side render flow.

And last, take a look of `webpack.prod.js`

**@coren-starter-kit/webpack.prod.js**
```js
const config = new CorenWebpack(__dirname, {
  entry: {
    ...
  },
  ...
});

module.exports = config.output();
```

When use coren, you can keep the original webpack setting.
The only thing you need to do is to use `new CorenWebpack(__dirname, <original webpack setting>)` this grammer.

So now, with `coren.config.js`, `Component`, and `CorenWebpack`, you can do coren ssr.

Install package:

```bash
npm install
```

Run coren, do server side render

```bash
npm run coren-production
```

After compiled, coren will create a `.coren` folder. This folder includes server side render result and coren internal file.

Let's take a look of `.coren/html/index.html`, `index` entry's ssr result.

**@coren-starter-kit/.coren/html/index.html**
```html
<!DOCTYPE html><html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Home</title>
    <meta name="description" content="home description">
    <link rel="stylesheet" href="/dist/css/index.css">
  </head>
  <body>
    <div id="root"><div data-reactroot="" data-reactid="1" data-react-checksum="2085429341"><h1 class="hello" data-reactid="2">Hello coren!!</h1></div></div>
    <script src="/dist/index.js"></script>
  </body>
</html>
```

It's great! Your ssr is ready!

What coren do for you?

* offline generate ssr and append result in `#root` ---> `@ssr`, `@route`
* add head `title`, `meta description` ----------------> `@head`
* append static file link

So it's very easy to use coren, and it's very easy to integrate coren in your current project.

### What's next?

We have server side render result. You can use a server to host it. Choose `any` framework to host this html.<br/>Currently, we provide an express middleware to make host coren ssr result easily.

Please open `app.js`

**@coren-starter-kit/app.js**
```js
var express = require('express');
var app = express();
var coren = require('coren/lib/server/coren-middleware');
...
app.use(coren(__dirname));
app.use('/dist', express.static(__dirname + '/.coren/public/dist'));

app.get('/', function(req, res) {
  return res.sendCoren('index');
});
...
```

This middleware provide some helpful methods to manipulate ssr result.

Congrats! You finish the brief introduction of coren.

Let' recap what we do to make coren work:

* add `coren.config.js`
* use `decorator` to wrap ssr component
* use `CorenWebpack` at webpack.config.js
* use coren middleware to host the file

Next, you can look at the documentation and understand how coren works internally.

# Documentation

### coren.config.js

`coren.config.js` is config file to make coren run correctly.

Below will introduce which key is supported.

- entry
- webpack
- registerCollector
- prepareContext

#### entry

> JS entry point you want to build (like webpack entry)

This entry will be used in `client webpack` & `server side webpack`.

So this is the `only` place to put your webapck entry.

- type: Object

**example:** 

```javascript
{
  entry: {
    index: './index.js'
  }
}
```

#### ssrWebpack

> server side render webpack setting

- type: Object

This webpack setting will be used during server side render. The configuration will be passed to `webpack` internally.

Just put any webpack configurations in here except `entry`.

**example:**

```javascript
{
   ssrWebpack: {
    plugins: [
      new webpack.BannerPlugin('This file is created by coren. Built time: ' + new Date())
    ]
  }
}
```

#### registerCollector

> register custom collectors to your applications

- type: Function(app, {context})
- return: App

This must be set. You need to setup your custom collectors.

**example:**

```javascript
const {HeadCollector, RoutesCollector} = require('coren');
module.exports = {
  registerCollector: function(app, {context}) {
    app.registerCollector("head", new HeadCollector());
    app.registerCollector("routes", new RoutesCollector({
      componentProps: {context}
    }));
    return app;
  },
}
```

#### prepareContext

> get context and pass context to coren

- type: Function
- return: Promise

`context` is a parameter pass to collector.

So if there are some parameter you want to pass to collector before coren start. Do it here.

**example:**

```javascript
{
  prepareContext: function() {
    return Promise.resolve({db: {auth: true}});
  }
}
```

#### assetsHost

> host path in different environment

- type: Fucntion(env: String, absolutePath: String)
- return: String

You need to provide `development`,  `pre-production` , and`production` environment return result.

**example:**

```javascript
{
  assetsHost: (env, absolutePath = '') => {
    const rel = path.relative(`${__dirname}/dist/`, absolutePath);
    switch (env) {
      case 'production':
        return `/dist/${rel}`; // example: /dist/index.js
      case 'development':
      case 'pre-production':
        return `http://localhost:9393/dist/${rel}`;
      default:
        return false;
    }
  }
}
```



### webpack configuration

To make server side render work, coren will do some needed process when you build client side webpack, so you need to extend `CorenWebpack` to make it work.

**example: webpack.config.dev.js**

```javascript
const CorenWebpack = require('coren/lib/client/webpack');

const config = new CorenWebpack(__dirname, {
  // Because coren.config.js already has `entry` setting,
  // here you dont need to write entry `value`.
  // only need to write other package you want to merge to entry value
  entry: {
    index: [
      'webpack-hot-middleware/client?reload=true',
      'babel-polyfill'
    ]
  }
  // write other webpack setting
});

module.exports = config.output();
```

The only thing you need to do is `new CorenWebpack` and put all your original webpack setting at the second parameter. 



### express

When use coren, you don't need to use other template engine like `pug`. The html file is built by coren. We will help you to append the proper static file link & `<head/>` config.

To make it work, coren provide a coren express middleware. This middleware will automatically load the proper html based on entry name. It also provide some basic api to help you alter the html return.

**example:**

```javascript
var express = require('express');
var app = express();
var coren = require('coren/lib/server/coren-middleware');

app.use(coren(__dirname));
app.use('/dist', express.static(__dirname + '/.coren/public/dist'));

app.get('/', function(req, res) {
  return res.sendCoren('index');
});

app.listen(9393, 'localhost', function(err) {
  console.log('Listening at http://localhost:9393');
});
```



## Start the project

Now open the `coren-starter-kit` folder, let's build the project and push it to production.

#### development

Type `npm start`.

After webpack building finished, type `npm run coren-dev`. This command will build html files.

Then open `http://localhost:9393`. Your app is worked !

#### production

Type `npm run prod`.

Coren will build `server-side-render` and `client site production code` to you.

So now you can deploy this app to `aws cloud`, `heroku`...

It will work well and with server side render.





So far, you can use `offline` server side rendering to build your app.

Next, we introduce the other feature of coren - `Collector`.

## Collector

**What is a `Collector`?**

`Collector` collect data from `define` methods, collector can choose which lifecycle it want to call `define` method.

With collector, you can inject head, body in ssr result. You also can use any framework at your app.

Let's see an example:

```javascript
import React, {Component} from 'react';
import {collector} from 'coren';
import './style.css';
@collector()
export default class Root extends Component {
  static defineHead() {
    return {
      title: "home",
      description: "home description"
    };
  }

  render() {
    return (
      <div className="hello">Hello Coren</div>
    );
  }
}
```

WIth `defineHead`, this page's html `head` would be

```html
<head>
  <title>home</title>
  <meta name="description" content="home description">
</head>
```

So you can use `Collector` to configure html result.



Three steps to use collector:

1. include and register needed collector at `coren.config.js`
2. use `collector()` decorator at the component will use collector.
3. use `defineXXXX` method at component.

Below list the collector that coren supports now.

#### HeadCollector

##### coren.config.js

```javascript
const {HeadCollector} = require('coren');
module.exports = {
  registerCollector: function(app, {context}) {
    app.registerCollector("head", new HeadCollector());
    return app;
  }
}
```

##### app

supported `define` api:

**defineHead**

- return: `{title: String, description: String}`

example:

```javascript
@collector()
export default class Root extends Component {
  static defineHead() {
    return {
      title: "home",
      description: "home description"
    };
  }
}
```

#### RouteCollector

##### coren.config.js

```javascript
const {RoutesCollector} = require('coren');
module.exports = {
  registerCollector: function(app, {context}) {
    app.registerCollector("routes", new RoutesCollector({
      componentProps: {context}
    }));
    return app;
  }
}
```

##### app

supported `define` api:

**defineRoutes**

- params: {Url, ParamUrl}
- return: `Url` instance || `ParamUrl` instance

example:

```javascript
@collector()
export default class Root extends Component {
  static defineRoutes({Url, ParamUrl}) {
    return new Url('/');
  }
}
```

#### ReduxCollector

With ReduxCollector, your app will support `PRELOADED_STATE`. It means that your redux app can get initial state directly from ssr result.

**coren.config.js**

```javascript
const {ReduxCollector} = require('coren');
const reducer = require('./reducer'); 
module.exports = {
  registerCollector: function(app, {context}) {
    app.registerCollector("redux", new ReduxCollector({
      componentProps: {context},
      reducers: reducer,
      configureStore: path.resolve(__dirname, './configureStore')
    }));
    return app;
  },
}
```

##### app

supported `define` api:

**definePreloadedState**

- return: Promise

example:

```javascript
@collector()
class UserList extends Component {
  static definePreloadedState() {
    return Promise.resolve({
      currentUser: {
        data: {},
        fetched: false,
        isFetching: false,
        error: false
      }
    });
  }
}
```

So collector is a fully customizable function. Based on different use case, you can add different collector do meet the demand.

### How to create own Collector

Write your own class, implement methods in [Collector](#Collector).

Take a look at built-in collector for reference.

https://github.com/Canner/coren/tree/master/server/collectors



## Express Integration - coren middleware

From above example, in our express server, just include `coren middleware` and then ssr is done.

It means that we don't need to require any react related code and coren module. So your server become cleaner and lower loading.

### API

#### res.setHead(Function($head: cheerio instance))

setHead api let you manipulate the content in `<head></head>`.

You can reference `cheerio` to know the supported api.

**example:**

```javascript
app.get('/', function(req, res) {
  res.setHead(function($head) {
    $head.append('<script>alert("coren!")');
  });
  return res.sendCoren('index');
});
```



#### res.setPreloadedState(Object)

merge preloadedState content.

With this api, the status of your app can be controlled by  server.

**example:**

```javascript
app.get('/', function(req, res) {
  res.setPreloadedState({auth: false, user: 'john'});
  return res.sendCoren('index');
});
```

#### res.sendCoren(`entry`)

sendCoren api use to send proper entry result. this `entry` is the same with `coren.config.js` entry.

So, if you want to return `index` entry, you can write: `res.sendCoren('index')`

**example:**

```javascript
var express = require('express');
var app = express();
var coren = require('coren/lib/server/coren-middleware');
app.use(coren()); // use middleware
app.use('/dist', express.static(__dirname + '/.coren/public/dist'));

app.get('/', function(req, res) {
  return res.sendCoren('index');
});
...
```

## Integrate with current project

Though coren is unstable now, in our concept, it's very easy to integrate coren to your current project.

Just follow these steps:

1. write `coren.config.js`
2. Use `new CorenWebpack` to extend webpack config
3. add `defineXXXXX` method at your component
4. add `coren middleware` at express server
5. start webpack server
6. after webpack is built, `npm run coren-dev` ( or `coren dev`)
7. start express



# Limitation

- Based on webpack: coren strongly count on webpack, currently it doesn't support other tools like `rollup`, `browserify`.
- Because coren is server side render framework, there are some modules that don't support `isomorphic` environment. For these modules, that may break the ssr.

# More Example

- complete coren example: https://github.com/Canner/coren-example
- simple example: https://github.com/Canner/coren/tree/master/examples/apps/

# 中文簡介

[Meduim 文章：Coren: React Composite Server-side Render](https://medium.com/canner-io-%E6%98%93%E9%96%8B%E7%A7%91%E6%8A%80/react-composite-server-side-render-a85a90f841f5)



# License

Apache-2.0 [@Canner](https://github.com/canner)

