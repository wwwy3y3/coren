import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import Home from './Home';
export default class Root extends Component {
  render() {
    return (
        <div>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><a href="/users">All Users</a></li>
          </ul>

          <hr/>
          <Route exact path="/" component={Home}/>
        </div>
    );
  }
}
