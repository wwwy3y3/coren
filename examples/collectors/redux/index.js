import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import Home from './Home';
import About from './About';

class Root extends React.Component {
  render() {
    return (
        <div>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>

          <hr/>

          <Route exact path="/" component={Home}/>
          <Route path="/about" component={About}/>
        </div>
    );
  }
}

export default Root;
