# withReactRouterReduxIntl
This example demostrate how to use `coren` with react-router, redux and react-intl

In addtion, This example only shows how `react-intl` is used with `coren`, so if you want know more about redux and react router, please take a look at this example instead  => [withReactRouterRedux](https://github.com/Canner/coren/blob/master/examples/apps/withReactRouterRedux/README.md)

## react-intl
To make intl work, first we need to prepare locale data.

This is our locale data:

**locales/data.json**:

```json
{
  "en": {
    "app.album.title": "Album List",
    "app.photo.title": "Photo List"
  },
  "zh": {
    "app.album.title": "相簿列表",
    "app.photo.title": "照片列表"
  }
}
```

So we need to import this locale data to coren at `coren.config.js`.

Now, take a look at `coren.config.js`

**coren.config.js**
```js
const localeData = require('./locales/data.json');

module.exports = {
  prepareContext: () => {
    return fetch("http://jsonplaceholder.typicode.com/albums")
            .then(albums => albums.json())
            .then(albumJson => {
              albumJson = albumJson.filter(item => {
                return item.id <= 2;
              });
              return fetch("http://jsonplaceholder.typicode.com/photos")
              .then(photos => photos.json())
              .then(photoJSON => {
                photoJSON = photoJSON.filter(item => {
                  return item.albumId <= 1;
                });
                return {albums: albumJson, photos: photoJSON, localeData};
              });
            });
  }
}
```

We use `prepareContext` function to pass some required data to coren, which will be passed as `localeData` parameter to `coren` decorators during server-side render.

After we prepare our locale data, it's time to write coren decorator!

Next, please take a look at `components/Photo.js`:

**components/Photo.js**
```js

@reactRouterReduxIntl({reducer})
@routeParams((props, context) => {
  const {photos} = context;
  return {
    url: '/:locale/photo/:id',
    dataProvider: () => {
      const result = [];
      photos.forEach(photo => {
        result.push({
          ...photo,
          locale: 'en'
        });
        result.push({
          ...photo,
          locale: 'zh'
        });
      });
      return Promise.resolve(result);
    }
  };
})
@headParams(options => {
  const {context, route} = options;
  const {photos} = context;
  const photoId = route.data.id;
  const photo = photos.filter(item => {
    return item.id === photoId;
  }).shift();
  return {
    title: photo.title,
    description: photos.title
  };
})
@preloadedState((props, options) => {
  const {context} = options;
  const {photos} = context;
  return Promise.resolve({
    photos: {
      data: photos,
      fetched: true,
      isFetching: false
    }
  });
})
@ssr
export default class ... {
  ...
}
```

We're going to explain the purpose of these decorators:

* routeParams: `routeParams` decorator let you pass parameters to other decorators while generating routes. In this example, we pass a `locale` paramter.
* reactRouterReduxIntl: This decorator will wrap your component with `IntlProvider` during server-side render process, and capable of getting `localeData` parameter we passed from `prepareContext`.

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
