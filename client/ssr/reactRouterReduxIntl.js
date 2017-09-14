import React from 'react';
import {StaticRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import {IntlProvider} from 'react-intl';
import {ssrDecorator} from '../ssrHelper';

export default ({reducer}) => {
  const name = 'reactRouterRedux';

  const setOptions = () => {
    // save initialstate
    const initialState = createStore(reducer).getState();
    return {initialState};
  };

  const wrapSSR = (appElement, options) => {
    const {route, context} = options;
    const {localeData} = context;
    const locale = route.data.locale;
    let store;
    if (options.preloadedState) {
      const {preloadedState} = options;
      const mergeState = Object.assign({}, options.initialState, preloadedState);
      store = createStore(reducer, mergeState);
    } else {
      store = createStore(reducer);
    }

    return (
      <IntlProvider locale={locale} messages={localeData[locale]}>
        <Provider store={store}>
          <StaticRouter location={route.path}>
            {appElement}
          </StaticRouter>
        </Provider>
      </IntlProvider>
    );
  };
  wrapSSR.displayName = 'wrapSSRCompoent';

  const cycle = {
    name,
    setOptions,
    wrapSSR
  };

  return ssrDecorator(cycle);
};
