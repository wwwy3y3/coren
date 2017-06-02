const path = require('path');
const {
  collectorManager,
  SingleRouteRenderer,
  HeadCollector,
  ReduxCollector
} = require('../server');

const DummyDB = require('./dummyDB');
const dummyDB = new DummyDB();

describe("ssr", function() {
  it('should render head', function() {
    collectorManager.init({
      appPath: path.resolve(__dirname, '../examples-dist/header')
    });
    collectorManager.registerCollector("head", new HeadCollector());
    const ssr = new SingleRouteRenderer({route: '/about', collectorManager});
    ssr.renderToString()
    .then(str => console.log(str));
  });

  it('should render redux', function() {
    collectorManager.init({
      appPath: path.resolve(__dirname, '../examples-dist/redux')
    });
    collectorManager.registerCollector("redux", new ReduxCollector({
      componentProps: {
        db: dummyDB
      },
      reducers: state => state
    }));
    const ssr = new SingleRouteRenderer({route: '/about', collectorManager});
    ssr.renderToString()
    .then(str => console.log(str))
    .catch(err => console.log(err));
  });
});

