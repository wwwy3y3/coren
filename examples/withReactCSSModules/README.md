# coren - withReactCssModule example
This example demonstrate that how to use `coren` with `react-css-module` & `extract-text-webpack-plugin`.

## Development
Coren integrate well with `webpack`, so you can enjoy server-side render while using any webpack loader and plugins you like.

In this example, we're using `react-hot-loader` to develop react application faster.

### Step 1. Start devServer
```
$ npm run webpack-server
```
![webpack-server](https://i.imgur.com/X7qVqKS.png)

After webpack-server finish build process, you'll see a message from terminal telling you to run `coren dev`

### Step 2. coren dev
You might wonder why we need to run ssr on local computer. Well, we don't. Coren simply generate pages without react elements, in order to respond html in `express`.

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

Now, take a look at `.coren/html/index.html`, you'll notice not only server-side rendered elements are inserted, coren insert js & css links for you.

``` html
<!DOCTYPE html><html><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>home</title><meta name="description" content="home description"><link rel="stylesheet" href="/dist/css/index.css"></head>
  <body><div id="root"><div data-reactroot="" data-reactid="1" data-react-checksum="-1592571512"><h1 class="client-___style__red___Ngq7r" data-reactid="2">use react-css-modules!</h1><button class="client-___style__hi___H2c8W" data-reactid="3">index file!</button></div></div>
  
  <script src="/dist/index.js"></script></body></html>
```

### Start webserver
```
$ npm start
```
Now, start your server, see what we build for you!

Easy, huh?
