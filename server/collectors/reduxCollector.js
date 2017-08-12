const {createStore} = require('redux');
const {Provider} = require('react-redux');
const react = require('react');
const Promise = require('bluebird');

class ReduxCollector {
  constructor({componentProps, reducers, configureStore}) {
    if (!configureStore) {
      throw new Error("configureStore is required in ReduxCollector");
    }
    this.preloadedStateGenerators = [];
    this.initialState = {};
    this.componentProps = componentProps;
    this.reducers = reducers;
    this.configureStore = configureStore;
  }

  ifEnter(component) {
    return component.definePreloadedState;
  }

  componentDidImport(id, component) {
    this.preloadedStateGenerators.push(component.definePreloadedState);
  }

  routeWillRender(route) {
    // clear initialState when new route render
    this.initialState = {};

    // execute user defined preloadedState
    const definePreloadedStateProps = Object.assign({}, this.componentProps, {route});
    const queries = this.preloadedStateGenerators.map(fn => fn(definePreloadedStateProps));
    return Promise.map(queries,
      state => Object.assign(this.initialState, state));
  }

  wrapElement(appElement) {
    const store = createStore(this.reducers, this.initialState);
    const wrapedElements = react.createElement(Provider, {store}, appElement);
    this.state = store.getState();
    return wrapedElements;
  }

  appendToHead($head) {
    $head.append(`<script data-coren>
      window.__PRELOADED_STATE__ = ${JSON.stringify(this.state)}
      </script>`);
  }

  wrapClientImport() {
    return `
      import {Provider} from 'react-redux';
      import configureStore from '${this.configureStore}';
      const preloadedState = window.__PRELOADED_STATE__;
      delete window.__PRELOADED_STATE__;
      const store = configureStore(preloadedState);`;
  }

  wrapClientRender($children) {
    return `
      <Provider store={store}>
        ${$children}
      </Provider>`;
  }
}

module.exports = ReduxCollector;
