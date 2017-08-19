require('should');
const path = require('path');
const {
  App,
  SingleRouteRenderer,
  MultiRoutesRenderer,
  HeadCollector,
  ReduxCollector,
  RoutesCollector,
  ScriptCollector,
  StyleCollector
} = require('../../');

const DummyDB = require('./dummyDB');
const dummyDB = new DummyDB();

describe("ssr", function() {
  it('should render head', function() {
    const app = new App({
      path: path.resolve(__dirname, '../examples-dist/header')
    });
    app.registerCollector("head", new HeadCollector());
    const ssr = new SingleRouteRenderer({route: '/about', app});
    ssr.renderToString()
    .then(str => str.should.be.ok());
  });

  it('should render redux', function() {
    const app = new App({
      path: path.resolve(__dirname, '../examples-dist/redux')
    });
    app.registerCollector("redux", new ReduxCollector({
      componentProps: {
        db: dummyDB
      },
      reducers: state => state
    }));
    const ssr = new SingleRouteRenderer({route: '/about', app});
    ssr.renderToString()
    .then(str => str.should.be.ok())
    .catch(err => console.log(err));
  });

  it('should render multi', function() {
    const app = new App({
      path: path.resolve(__dirname, '../examples-dist/routes')
    });
    app.registerCollector("head", new HeadCollector());
    app.registerCollector("script", new ScriptCollector());
    app.registerCollector("style", new StyleCollector());
    app.registerCollector("routes", new RoutesCollector({
      componentProps: {
        db: dummyDB
      }
    }));
    const ssr = new MultiRoutesRenderer({app});
    ssr.renderToString()
    .then(str => str.should.be.ok())
    .catch(err => console.log(err));
  });
});

