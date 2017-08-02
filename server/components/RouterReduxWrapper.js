/* eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter as Router} from 'react-router-dom';

const preloadedState = window.__PRELOADED_STATE__;
delete window.__PRELOADED_STATE__;

const store = configureStore(preloadedState);

ReactDOM.render(
  <div>
    <Provider store={store}>
      <Router>
        <App/>
      </Router>
    </Provider>
  </div>
, document.getElementById('root'));
