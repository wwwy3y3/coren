import React from 'react';
import {StaticRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import {ssrDecorator} from '../ssrHelper';

export default ({reducer}) => {
  const name = 'reactRouterRedux';

  const wrapSSR = (appElement, options) => {
    const {route} = options;
    let store;
    if (options.preloadedState) {
      const {preloadedState} = options;
      store = createStore(reducer, preloadedState);
    } else {
      store = createStore(reducer);
    }
    return (
      <Provider store={store}>
        <StaticRouter location={route.path}>
          {appElement}
        </StaticRouter>
      </Provider>
    );
  };
  wrapSSR.displayName = 'wrapSSRCompoent';

  const cycle = {
    name,
    wrapSSR
  };

  return ssrDecorator(cycle);
};
