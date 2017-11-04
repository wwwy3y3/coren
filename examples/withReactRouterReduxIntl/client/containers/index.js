import React from 'react';
import ReactDOM from 'react-dom';
import Index from '../components/index';

ReactDOM.render(
  <Index/>
, document.getElementById('root'));


if(module.hot) {
  module.hot.accept();
}
