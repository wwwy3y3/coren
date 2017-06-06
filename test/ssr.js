const path = require('path');
const {
  CollectorManager,
  SingleRouteRenderer,
  MultiRoutesRenderer,
  HeadCollector,
  ReduxCollector,
  RoutesCollector
} = require('../');

const DummyDB = require('./dummyDB');
const dummyDB = new DummyDB();

describe("ssr", function() {
  it('should render head', function() {
    const collectorManager = new CollectorManager({
      appPath: path.resolve(__dirname, '../examples-dist/header')
    });
    collectorManager.registerCollector("head", new HeadCollector());
    const ssr = new SingleRouteRenderer({route: '/about', collectorManager});
    ssr.renderToString()
    .then(str => console.log(str));
  });

  it('should render redux', function() {
    const collectorManager = new CollectorManager({
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

  it('should render multi', function() {
    const collectorManager = new CollectorManager({
      appPath: path.resolve(__dirname, '../examples-dist/routes')
    });
    collectorManager.registerCollector("head", new HeadCollector());
    collectorManager.registerCollector("routes", new RoutesCollector({
      componentProps: {
        db: dummyDB
      }
    }));
    const ssr = new MultiRoutesRenderer({collectorManager});
    ssr.renderToString()
    .then(str => console.log(str))
    .catch(err => console.log(err));
  });
});

