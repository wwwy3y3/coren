
import App from "../../index.js";

import configureStore from "../../configureStore.js";
var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRedux = require('react-redux');

var _reactRouterDom = require('react-router-dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var preloadedState = window.__PRELOADED_STATE__;
delete window.__PRELOADED_STATE__;

var store = configureStore(preloadedState);

_reactDom2['default'].render(_react2['default'].createElement(
  'div',
  null,
  _react2['default'].createElement(
    _reactRedux.Provider,
    { store: store },
    _react2['default'].createElement(
      _reactRouterDom.BrowserRouter,
      null,
      _react2['default'].createElement(App, null)
    )
  )
), document.getElementById('root'));
    
    