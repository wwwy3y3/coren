import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import {ssr, reactRouterRedux, wrapDOM} from 'coren';
import Home from './Home';
import UserList from './UserList';
import User from './User';
import {BrowserRouter as Router} from 'react-router-dom';
import {Provider} from 'react-redux';
import configureStore from '../configureStore';
import reducer from '../reducer';

let store;
if (process.env.isBrowser) {
  const preloadedState = window.__PRELOADED_STATE__;
  delete window.__PRELOADED_STATE__;
  store = configureStore(preloadedState);
}

@reactRouterRedux({reducer})
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
