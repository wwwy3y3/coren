import React from 'react';
import ReactDOM from 'react-dom';
import Content from "./Content";

ReactDOM.render(
  <div>
    <Content/>
  </div>
, document.getElementById('root'));

if (module.hot) {
  module.hot.accept();
}
