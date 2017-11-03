import React from 'react';
import ReactDOM from 'react-dom';
import Content from "./Content";

ReactDOM.render(
  <Content/>
, document.getElementById('root'));

if (module.hot) {
  module.hot.accept();
}
