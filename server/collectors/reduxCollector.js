const {createStore} = require('redux');
const {Provider} = require('react-redux');
const react = require('react');
const Promise = require('bluebird');

class ReduxCollector {
  constructor({componentProps, reducers}) {
    this.queries = [];
    this.initialState = {};
    this.componentProps = componentProps;
    this.reducers = reducers;
  }

  ifEnter(component) {
    return component.definePreloadedState;
  }

  componentDidImport(component) {
    const promise = component.definePreloadedState(this.componentProps);
    this.queries.push(promise);
  }

  prepare() {
    return Promise.map(this.queries,
      state => Object.assign(this.initialState, state));
  }

  appendToHead($head) {
    $head.append(`<script>
      window.__PRELOADED_STATE__ = ${JSON.stringify(this.state)}
      </script>`);
  }

  wrapApp(appElement) {
    const store = createStore(this.reducers, this.initialState);
    const wrapedElements = react.createElement(Provider, {store}, appElement);
    this.state = store.getState();
    return wrapedElements;
  }
}

module.exports = ReduxCollector;
