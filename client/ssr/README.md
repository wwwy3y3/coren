# coren decorator

Before using other decorators, you need to append `@ssr` and `@route` or `@routeParams` first at the page you want coren to do ssr.

### ssr

tell coren do ssr at this component.

### route

tell coren the route at this component.

### routeParams

routeParams is used to tell coren to generate assigned route html pages.

The different is because it accepts `dataProvider` as the parameter to generate route, it can generate multi routes. It meas it can generate multi page based on current component.

example:

example:

```js
@routeParams((props, context) => {
  const {db} = context;
  return {
    url: '/users/:id',
    dataProvider: () => Promise.resolve([{id: 1}, {id: 2}, {id: 3}])
  };
})
@ssr
export default class ... {
  ...
}
```

It will render `/users/1`, `/users/2` and `/users/3` base on this component.

### head

head decorator can append `title` and `description` in output html.

example:

```js
import {ssr, route, head} from 'coren';

@head({title: "home", description: "home description"})
@route('/')
@ssr
export default class ... {
  ...
}
```

### headParams

The different between head & headParams is headParams pass a function to decorator. After execute this function, decorator can get the `title` and `description`.

Most of the situation, headParams and routeParams are used together.

example:

```js
@headParams(options => {
  const {route} = options;
  const userId = route.data.id;
  return {
    title: `user ${userId}`,
    description: `user ${userId}`
  };
})
@routeParams((props, context) => {
  const {db} = context;
  return {
    url: '/users/:id',
    dataProvider: () => Promise.resolve([{id: 1}, {id: 2}, {id: 3}])
  };
})
@ssr
export default class ... {
  ...
}
```

So at different page, it generate different `title`, `description`.

* `/users/1` => `{title: 'users 1', description: 'description 1'}`
* `/users/2` => `{title: 'users 2', description: 'description 2'}`
* `/users/3` => `{title: 'users 3', description: 'description 3'}`

### preloadedState

preloadedState is used with [redux server render](http://redux.js.org/docs/recipes/ServerRendering.html#inject-initial-component-html-and-state).

When you set preloadedState, coren will append `<script data-coren>window.__PRELOADED_STATE__ = ${JSON.stringify(state)}</script>` this script at html output.

example:

```
@preloadedState((props, options) => {
  const {route} = options;
  const user = route.data;
  return Promise.resolve({
    currentUser: {
      data: user,
      fetched: true,
      isFetching: false,
      error: false
    }
  });
})
@route('/')
@ssr
export default class ... {
  ...
}
```

### reactRedux

When your project is used `react-redux` package, use `reactRedux` decorator to wrap your component.

This decorator will wrap `<Provider/>` at your component in ssr stage.

example:

```js
import reducer from './reducer';

@reactRedux({reducer})
@route('/')
@head({title: 'home', description: 'home description'})
@ssr
export default class ... {
  ...
}
```

### reactRouterRedux

When your project is used `react-router` and `redux`, use `reactRouterRedux` decorator to wrap your component.
When your project is used `react-router` and `redux`, use `reactRouterRedux` decorator to wrap your component.

This decorator will wrap `<Provider/>` and `<StaticRouter/>` at your component is ssr stage.

example:

```js
@reactRouterRedux({reducer})
@route('/')
@head({title: 'home', description: 'home description'})
@ssr
export default class ... {
}
```

### reactRouterReduxIntl

When your project is used `react-router`, `redux` and `react-intl`, use `reactRouterReduxIntl` decorator to wrap your component.

This decorator will wrap `<IntlProvider/>`, `<Provider/>` and `<StaticRouter/>` at your component is ssr stage.

```js
@reactRouterReduxIntl({reducer})
@routeParams((props, context) => {
  ...
})
@headParams(options => {
  ...
})
@preloadedState((props, options) => {
  ...
})
@ssr
export default class ... {
  ...
}
```

and where is locale data?

You need to return your locale data at `coren.config.js` `prepareContext` method.

**coren.config.js** example:

```js
import localeData from './localeData';
module.exports = {
  prepareContext: () => {
    return Promise.resolve({localeData});
}
```

With this setting, coren will use corresponding locale data based on different language.

