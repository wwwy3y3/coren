# render
React Pluggable Serverside Render

## usage
``` js
@collector()
export default class About extends Component {
  static defineHead() {
    return {
      title: "about",
      description: "description"
    };
  }

  render() {
    return <div>
      <Inner />
    </div>;
  }
}
```

``` js
const {
  collectorManager,
  SingleRouteRenderer,
  HeadCollector
} = require('@canner/render');

collectorManager.init({
  appPath: "path/to/react-app"
});

// register collectors
collectorManager.registerCollector("head", new HeadCollector());

// ssr with single route
const ssr = new SingleRouteRenderer({route: '/about', collectorManager});

// html will have title & description in it
const html = ssr.renderToString();
```
