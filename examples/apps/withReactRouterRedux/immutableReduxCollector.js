const {createStore} = require('redux');
const {Provider} = require('react-redux');
const react = require('react');
const immutable = require('immutable');
const {ReduxCollector} = require('coren');
const {isEmpty} = require('lodash');

module.exports = class ImmutableReduxCollector extends ReduxCollector {

  appendToHead($head) {
    $head.append(`<script src="https://cdnjs.cloudflare.com/ajax/libs/immutable/3.8.1/immutable.min.js"></script>`);
    $head.append(`<script data-coren>
      window.__PRELOADED_STATE__ = Immutable.fromJS(${JSON.stringify(this.state ? this.state.toJS() : {})})
      </script>`);
  }

  wrapElement(appElement) {
    const store = createStore(this.reducers, isEmpty(this.initialState) ? undefined : immutable.fromJS(this.initialState));
    const wrapedElements = react.createElement(Provider, {store}, appElement);
    this.state = store.getState();
    return wrapedElements;
  }
}
