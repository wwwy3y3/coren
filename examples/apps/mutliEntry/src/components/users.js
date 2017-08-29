import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import UserList from './UserList';
import User from './User';

export default class Root extends Component {
  render() {
    return (
        <div>
          <ul>
            <li><a href="/">Home</a></li>
            <li><Link to="/users">All Users</Link></li>
          </ul>

          <hr/>
          <Route exact path="/users" component={UserList}/>
          <Route exact path="/users/:id" component={User}/>
        </div>
    );
  }
}
