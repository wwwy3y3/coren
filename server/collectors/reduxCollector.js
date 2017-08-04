const {createStore} = require('redux');
const {Provider} = require('react-redux');
const react = require('react');
const Promise = require('bluebird');

class ReduxCollector {
  constructor({componentProps, reducers, configureStore}) {
    if (!configureStore) {
      throw new Error("configureStore is required in ReduxCollector");
    }
    this.queries = [];
    this.initialState = {};
    this.componentProps = componentProps;
    this.reducers = reducers;
    this.configureStore = configureStore;
  }

  ifEnter(component) {
    return component.definePreloadedState;
  }

  componentDidImport(id, component) {
    const promise = component.definePreloadedState(this.componentProps);
    this.queries.push(promise);
  }

  appWillRender() {
    return Promise.map(this.queries,
      state => Object.assign(this.initialState, state));
  }

  appendToHead($head) {
    $head.append(`<script data-coren>
      window.__PRELOADED_STATE__ = ${JSON.stringify(this.state)}
      </script>`);
  }

  wrapElement(appElement) {
    const store = createStore(this.reducers, this.initialState);
    const wrapedElements = react.createElement(Provider, {store}, appElement);
    this.state = store.getState();
    return wrapedElements;
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
