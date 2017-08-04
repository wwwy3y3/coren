import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import Home from './Home';
import About from './About';
import Product from './Product';

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
          <Route path="/products/:id" component={Product}/>
        </div>
    );
  }
}

export default Root;
