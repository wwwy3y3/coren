const co = require('co');
const mapValues = require('lodash/mapValues');
const {createStore} = require('redux');
const {Provider} = require('react-redux');
const react = require('react');

class ReduxCollector {
  constructor({componentProps, reducers}) {
    this.queries = {};
    this.states = {};
    this.componentProps = componentProps;
    this.reducers = reducers;
  }

  ifEnter(component) {
    return component.definePreloadedState;
  }

  componentDidImport(component) {
    Object.assign(this.queries, component.definePreloadedState(this.componentProps));
  }

  prepare() {
    const self = this;
    return co(function * () {
      self.states = yield mapValues(self.queries, query => query.exec());
    });
  }

  appendToHead($head) {
    $head.append(`<script>
      window.__PRELOADED_STATE__ = ${JSON.stringify(this.finalState)}
      </script>`);
  }

  wrapApp(appElement) {
    const store = createStore(this.reducers, this.states);
    const wrapedElements = react.createElement(Provider, {store}, appElement);
    this.finalState = store.getState();
    return wrapedElements;
  }
}

module.exports = ReduxCollector;
