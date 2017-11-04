# withReactRouterRedux

This example demostrate how to use `coren` with `react-router` and `react-redux`.

The server-side render procress of `coren` is heavily rely on the lifecycles, defined by decorators.

At first, please take a look at `client/containers/index.js` file.

**container/index.js**
``` js
@reactRouterRedux({reducer})
@wrapDOM(({children}) => {
  return (
    <Provider store={store}>
      <Router>
        {children}
      </Router>
    </Provider>
  );
})
@ssr
export default class Root extends Component {
  //...
}
```

you'll notice that we're using three decorators here: `@reactRouterRedux`, `@wrapDOM` and `@ssr`

* ssr: ssr decorator is the decorator you must use, in order to tell `coren` to render this component
* wrapDOM: this decorator is just a helper function help you wrap component with required providers (e.g, react-redux Provider)
* reactRouterRedux: This decorator tell `coren` to wrap your component with `<StaticRouter>` and `<Provider>`

## Home Component
Now we take a look at the component Home component, which we render in Index component with React-router `<route>` 

**components/Home.js**

```js
@reactRouterRedux({reducer})
@route('/')
@head({title: 'home', description: 'home description'})
@ssr
export default class Root extends Component {

  render() {
    return (
      <div>
        Home Content
      </div>
    );
  }
}

```

We're going to explain what these decorators do
* head: tell coren to append title and description to head element in HTML
* route: tell coren to render this component with `index`(/) route

So after ssr, coren will generate an `index.html` file with head & meta description.

## User Component

Now, take a look at `components/User.js` file.

**components/User.js**

```js
@reactRouterRedux({reducer})
@routeParams((props, context) => {
  const {db} = context;
  return {
    url: '/users/:id',
    dataProvider: () => db.users.find().execAsync()
  };
})
@headParams(options => {
  const {route} = options;
  const userId = route.data.id;
  return {
    title: `user ${userId}`,
    description: `user ${userId}`
  };
})
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
@ssr
export default class UserList extends Component {
  //...
}
```

Now, allow me explain purpose of these decorators

* preloadedState: when we server-side render this
 component, we want to insert preloadedState here, so we don't have to call api request at front-end. `coren` will append initial state in your html with whatever you return in preloadedState
* headParams: headParams is just like `head` decorator, but provided with more parameters you can use
* routeParams: routeParams can tell `coren` generate multiple server-side render routes.

## Development
### Step 1. Start devServer
```
$ npm run webpack-server
```

After webpack-server finish build process, you'll see a message from terminal telling you to run `coren dev`

### Step 2. coren dev
```
$ npm run coren-dev
```

So after running this command, you might notice there's no server-side rendered elements in your body element.

### Step 3. Start Server
Now start your webserver, and enjoy your development.

```
$ npm start
```

then open `http://localhost:9393`

## Production deploy
Simply run `coren production --webpack  <your webpack link>`, coren will run webpack for you, and build HTML pages with server-side rendered react elements under `.coren/html`, which you should deploy to production server.

```
$ npm run coren-production
```

### Start webserver
```
$ npm start
```
Now, start your server, see what we build for you!

Easy, huh?
