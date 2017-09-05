import React, {Component} from 'react';
import {Route, Link, StaticRouter} from 'react-router-dom';
import {ssr, wrapSSR, wrapDOM, head} from 'coren';
import Home from './Home';
import UserList from './UserList';
import User from './User';
import {BrowserRouter as Router} from 'react-router-dom';
import {Provider} from 'react-redux';
import configureStore from '../configureStore';

let store;
if (process.env.isBrowser) {
  const preloadedState = window.__PRELOADED_STATE__;
  delete window.__PRELOADED_STATE__;
  store = configureStore(preloadedState);
}

@wrapSSR(appElement => {
  return (
    <Provider>
      <StaticRouter>
        {appElement}
      </StaticRouter>
    </Provider>
  );
})
@wrapDOM(({children}) => {
  return (
    <Provider store={store}>
      <Router>
        {children}
      </Router>
    </Provider>
  );
})
@ssr
export default class Root extends Component {
  render() {
    return (
        <div>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/users">All Users</Link></li>
            <li><a href="/about">About</a></li>
          </ul>

          <hr/>
          <Route exact path="/" component={Home}/>
          <Route exact path="/users" component={UserList}/>
          <Route exact path="/users/:id" component={User}/>
        </div>
    );
  }
}
