# withReactRouterRedux

This example shows how to use coren with react-router / redux.

<hr/>

At the readme, we will tell you how coren work with react-router/redux.

coren use lots of decorator to make server-side render work.

And because the concep of decorator is wrap function, we read the decorator from the bottom up.

First, look at `containers/index.js` file.

At this file, we wrap it with three decorators: `@reactRouterRedux`, `@wrapDOM`, `@ssr`

* ssr: ssr decorator is the necessary decorator in every coren page.
* wrapDOM: This decorator wrap client side needed component, to make react-router & redux can work correctly.
* reactRouterRedux: This decorator will wrap `StaticRouter` at your component in server-side render stage.

And then follow the react-router path, take a look at `Home` component.

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

* ssr: coren needed
* head: tell coren, this page's title & description
* route: this page as `index`(/) route
* reactRouterRedux: This decorator will wrap `StaticRouter` at your component in server-side render stage.

So after ssr, this page will become a `index.html` file & with custom `<head/> & meta description.

So far, it's the simple usage of coren.
Next, we want to introduce more powerful application of coren.

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
```

In real world case, we will have more than one user. It means we need to generate different content for different users.

decorators:

* preloadedState: because this is redux application, when you define preloadedState, coren will append initial state in your html. Thus, it doesn't need to load the initial data from server.
* headParams: headParams is a `<head/>` decorator that can let you pass variable. So you can render custom head based on different user data.
* routeParams: routeParams can generate multiple server-side render page based on different url defined.


So with these decorators, you can generate any server-side render page you want.
