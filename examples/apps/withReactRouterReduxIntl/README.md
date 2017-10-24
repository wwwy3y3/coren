# withReactRouterReduxIntl

> coren example use react-router, redux, react-intl

This example extends from [withReactRouterRedux](https://github.com/Canner/coren/blob/master/examples/apps/withReactRouterRedux/README.md), so you will be clear after you read [withReactRouterRedux](https://github.com/Canner/coren/blob/master/examples/apps/withReactRouterRedux/README.md) tutorial.

<hr/>

To make intl work, first, we need to prepare locale data.

This is our example locale data:

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

take a look at `coren.config.js`

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

We use `prepareContext` function to pass some needed data to coren. So we pass `localeData` to coren before server-side render.

Now, after we prepare our locale data, it's time to write coren decorator!

First look at `components/Photo.js`:

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

decorator:

* routeParams: The different part of routeParams is we pass a `locale` paramter.
* reactRouterReduxIntl: This decorator will wrap `IntlProvider` in server side render stage, and get the `localeData` from context.

And then coren with intl is done.

Wrap `reactRouterReduxIntl` at each page you want to support intl.









