# Coren

[![npm Version](https://img.shields.io/npm/v/coren.svg?style=flat-square)](https://www.npmjs.org/package/coren) [![Build Status](https://travis-ci.org/Canner/coren.svg?branch=master)](https://travis-ci.org/Canner/coren)

React Pluggable Serverside Render

# Features

- **Offline** ssr solution: your server will not include any react related code but still can do ssr.
- **:electric_plug: Pluggable:** You can customize your own [collector](#collector) for your own need
- **Access to Component Props:** in [componentDidConstruct](#componentDidConstruct) method from [Lifecycle Hook](#lifecycle-hook) you can access to component props
- **Pass Variables To Component:** [Collector](#collector) can pass anything you want(`DB Query`, `Server API`) to [Define](#define) method
- **Production stage** ssr: just run coren before deploy code



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

- [How to use?](#how-to-use)
  * [Setup](#setup)
  * [What coren do?](#what-coren-do)
  * [coren.config.js](#corenconfigjs)
      - [entry](#entry)
      - [webpack](#webpack)
      - [registerCollector](#registercollector)
      - [prepareContext](#preparecontext)
  * [Collector](#collector)
      - [HeadCollector](#headcollector)
      - [RouteCollector](#routecollector)
      - [ReduxCollector](#reduxcollector)
    + [How to create own Collector](#how-to-create-own-collector)
  * [Express Integration - coren middleware](#express-integration---coren-middleware)
    + [API](#api)
      - [res.sendCoren(<entry>, {updatePreloadedState?: {}})](#ressendcorenentry-updatepreloadedstate-)
  * [Integrate with current project](#integrate-with-current-project)
- [Limitation](#limitation)
- [More Example](#more-example)
- [中文簡介](#%E4%B8%AD%E6%96%87%E7%B0%A1%E4%BB%8B)
  * [License](#license)

# How to use?

## Setup

Install coren and needed package.

``` bash
npm install coren react react-dom express —save
```

then add coren script at package.json scripts setting

``` json
{
  "scripts": {
    "coren": "coren"
  }
}
```

after that you can start build your react app!

Now add `index.js` & `style.css` file:

**index.js**

``` js
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

**style.css**

``` css
.hello {
  font-size: 50px;
  color: orange;
}
```

Then you need to add `coren.config.js`, that is the config file use to tell coren this repo's setting.

**coren.config.js**

``` javascript
const webpack = require('webpack');
const {HeadCollector} = require('coren');

module.exports = {
  entry: {
    index: './index.js'
  },
  webpack: {
    plugins: [
      new webpack.BannerPlugin('This file is created by coren. Built time: ' + new Date())
    ]
  },
  registerCollector: function(app) {
    app.registerCollector("head", new HeadCollector());
    return app;
  }
};
```

just run `npm run coren`, coren will build your app and do server side render.

Now, you finish building hello world app. It's time to use express to serve it!

add **app.js**

``` javascript
var express = require('express');
var app = express();
var coren = require('coren/lib/server/coren-middleware');
app.use(coren());
app.use('/dist', express.static(__dirname + '/.coren/public/dist'));

app.get('/', function(req, res) {
  return res.sendCoren('index');
});

app.listen(9393, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:9393');
});
```

after that, here is your folder structure:

``` javascript
.
├── .coren
├── coren.config.js
├── index.js
├── package.json
├── style.css
└── app.js
```

just run `node app.js` to start express server and open `http://localhost:9393`. 

Your server side render and bundle script is done!

[simple example](https://github.com/Canner/coren/tree/master/examples/apps/withCss)

## What coren do?

- Automatically generate server side render result
- Build static file: coren use webpack to build your app`(index.js)` and export your `css`
- Smartly serve the ssr result

And that's it. coren is easy to setup and easy to integrate in your current project.

You only need to use proper collector and setup `coren.config.js`, how to do ssr, how to build your static file is coren's responsibility.

## coren.config.js

`coren.config.js` is config file to make coren run correctly.

Below will introduce which key is supported.

- entry
- webpack
- registerCollector
- prepareContext

#### entry

> app you want to build (like webpack entry)

- type: Object

**example:** 

``` javascript
{
  entry: {
    index: './index.js'
  }
}
```

#### webpack

> custom webpack setting

- type: Object

This setting is the same as webpack.

Just put any webpack config in here except `entry`.

**example:**

``` javascript
{
   webpack: {
    plugins: [
      new webpack.BannerPlugin('This file is created by coren. Built time: ' + new Date())
    ]
  }
}
```

#### registerCollector

> register this app's custom collector

- type: Function(app, {context})
- return: App

require needed collector and register it at this setting.

**example:**

``` javascript
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

> use to get context and pass context to coren

- type: Function
- return: Promise

`context` is a parameter pass to collector.

So if there are some parameter you want to pass to collector before coren start. Do it here.

**example:**

``` javascript
{
  prepareContext: function() {
    return Promise.resolve({db: {auth: true}});
  }
}
```



## Collector

Above example, coren use static method starting with `define` and `collector` decorator to make coren work.

**What is a `Collector`?**

`Collector` collect data from `define` methods, collector can choose which lifecycle it want to call `define` method.

With collector, you can inject head, body in ssr result. You also can use any framework at your app.

The follow to use collector:

1. include and register needed collector at `coren.config.js`
2. use `collector()` decorator at the component will use collector.
3. use `defineXXXX` method at component.

Below list the collector that coren supports now.

#### HeadCollector

##### coren.config.js

``` javascript
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

``` javascript
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

``` javascript
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

``` javascript
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

``` javascript
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

``` javascript
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

#### res.sendCoren(<entry>, {updatePreloadedState?: {}})

sendCoren api use to send proper entry result. this `entry` is the same with `coren.config.js` entry.

So, if you want to return `index` entry, you can write: `res.sendCoren('index')`

**example:**

``` javascript
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

1. write `coren.config.js`: including transfer webpack `production` setting
2. add `defineXXXXX` method at your component
3. add `coren middleware` at express server
4. `npm run coren`

Then just run deploy method to deploy this project.

# Limitation

- Based on webpack: coren strongly count on webpack, currently it doesn't support other tools like `rollup`, `browserify`. 


# More Example

- complete coren example: https://github.com/Canner/coren-example
- simple example: https://github.com/Canner/coren/tree/master/examples/apps/

# 中文簡介

[Meduim 文章：Coren: React Composite Server-side Render](https://medium.com/canner-io-%E6%98%93%E9%96%8B%E7%A7%91%E6%8A%80/react-composite-server-side-render-a85a90f841f5)


## License

Apache-2.0 [@Canner](https://github.com/canner)
