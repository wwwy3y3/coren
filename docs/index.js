import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router
} from 'react-router-dom';
import RootApp from '../examples/header';

class Root extends React.Component {
  render() {
    return (
      <Router>
        <RootApp />
      </Router>
    );
  }
}

ReactDOM.render(
  <Root/>
, document.getElementById('root'));
