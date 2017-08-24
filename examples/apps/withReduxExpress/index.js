import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import {Provider} from 'react-redux';
import Home from "./Home";
import configureStore from './configureStore';

const preloadedState = window.__PRELOADED_STATE__;
delete window.__PRELOADED_STATE__;
const store = configureStore(preloadedState);

ReactDOM.render(
  <div>
    <Provider store={store}>
      <Router>
        <Home/>
      </Router>
    </Provider>
  </div>
, document.getElementById('root'));
