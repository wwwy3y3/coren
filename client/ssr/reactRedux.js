import React from 'react';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import {ssrDecorator} from '../ssrHelper';

export default ({reducer}) => {
  const name = 'reactRedux';

  const wrapSSR = (appElement, options) => {
    let store;
    if (options.preloadedState) {
      const {preloadedState} = options;
      store = createStore(reducer, preloadedState);
    } else {
      store = createStore(reducer);
    }
    return (
      <Provider store={store}>
        {appElement}
      </Provider>
    );
  };
  wrapSSR.displayName = 'wrapReactReduxCompoent';

  const cycle = {
    name,
    wrapSSR
  };

  return ssrDecorator(cycle);
};
