import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import {IntlProvider} from 'react-intl';
import {ssr, reactRouterRedux, wrapDOM} from 'coren';
import AlbumList from './AlbumList';
import Album from './Album';
import Photo from './Photo';
import {BrowserRouter as Router} from 'react-router-dom';
import {Provider} from 'react-redux';
import configureStore from '../configureStore';
import reducer from '../reducer';
import localeData from '../locales/data.json';

let store;
if (process.env.isBrowser) {
  const preloadedState = window.__PRELOADED_STATE__;
  delete window.__PRELOADED_STATE__;
  store = configureStore(preloadedState);
}

@wrapDOM(({children}) => {
  return (
    <IntlProvider locale="en" messages={localeData.en}>
      <Provider store={store}>
        <Router>
          {children}
        </Router>
      </Provider>
    </IntlProvider>
  );
})
export default class Root extends Component {
  render() {
    return (
      <div>
        <Route exact path="/:locale" component={AlbumList}/>
        <Route exact path="/:locale/album/:id" component={Album}/>
        <Route exact path="/:locale/photo/:id" component={Photo}/>
      </div>
    );
  }
}
