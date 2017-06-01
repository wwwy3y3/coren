const path = require('path');
const {
  collectorManager,
  SingleRouteRenderer,
  HeadCollector
} = require('../server');

describe("ssr", function() {
  it('should render head', function() {
    collectorManager.init({
      appPath: path.resolve(__dirname, '../examples-dist/header')
    });
    collectorManager.registerCollector("head", new HeadCollector());
    const ssr = new SingleRouteRenderer({route: '/about', collectorManager});
    const str = ssr.renderToString();
    console.log(str);
  });
});

