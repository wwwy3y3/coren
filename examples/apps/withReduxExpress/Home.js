import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {collector} from 'coren';
import {login, logout} from './actions';
import './style.css';

@collector()
@connect(mapStateToProps, mapDispatchToProps)
export default class Index extends Component {
  constructor(props) {
    super(props);
    this.toggleAuth = this.toggleAuth.bind(this);
  }
  static defineHead() {
    return {
      title: "redux",
      description: "redux content"
    };
  }

  static definePreloadedState() {
    return Promise.resolve({
      auth: false
    });
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
            you've log in.
          </span>
        : <span>
            you've log out.
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
