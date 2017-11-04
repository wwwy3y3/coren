# coren - withRedux
This example demostrate how to use `coren` with redux and update preloadedState in server.

## Server update redux state
Take a look at `server/app.js`

``` js
app.get('/*', function(req, res) {
  return res.setPreloadedState({auth: true}).sendCoren('/');
});
```

After we prerender HTML with coren, server can update the preloadedState in HTML with `res.setPreloadedState()`, so client don't have to fetch API.

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
