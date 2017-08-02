import {createStore} from 'redux';
import {Provider} from 'react-redux';
import react from 'react';
import immutable from 'immutable';
// import {ReduxCollector} from 'coren';
import ReduxCollector from './ReduxCollector';
import {isEmpty} from 'lodash';

export default class ImmutableReduxCollector extends ReduxCollector {

  appendToHead($head) {
    $head.append(`<script src="https://cdnjs.cloudflare.com/ajax/libs/immutable/3.8.1/immutable.min.js"></script>`);
    $head.append(`<script>
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
