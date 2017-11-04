import React, {Component} from 'react';
import {connect} from 'react-redux';
import {ssr, head, route, reactRedux, wrapDOM} from 'coren';
import {Provider} from 'react-redux';
import configureStore from './configureStore';
import reducer from './reducer';
import {login, logout} from './actions';
import './style.css';

let store;
if (process.env.isBrowser) {
  const preloadedState = window.__PRELOADED_STATE__;
  delete window.__PRELOADED_STATE__;
  store = configureStore(preloadedState);
}

@reactRedux({reducer})
@wrapDOM(({children}) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
})
@route('/')
@head({title: 'home', description: 'home description'})
@ssr
@connect(mapStateToProps, mapDispatchToProps)
export default class Index extends Component {
  constructor(props) {
    super(props);
    this.toggleAuth = this.toggleAuth.bind(this);
  }

  toggleAuth() {
    const {auth, login, logout} = this.props;
    if (auth) {
      logout();
    } else {
      login();
    }
  }

  render() {
    const {auth} = this.props;
    return (
      <div>
        {auth ?
          <span>
            you've logged in.
          </span>
        : <span>
            you've logged out.
          </span>
        }
        <button onClick={this.toggleAuth}>
          {auth ?
            <span>logout</span>
          : <span>login</span>
          }
        </button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}

function mapDispatchToProps(dispatch) {
  return {
    login: () => dispatch(login()),
    logout: () => dispatch(logout())
  };
}
