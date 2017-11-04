import React, {Component} from 'react';
import {ssr, head, route, reactRouterRedux} from 'coren';
import reducer from '../reducer';

@reactRouterRedux({reducer})
@route('/')
@head({title: 'home', description: 'home description'})
@ssr
export default class Root extends Component {

  render() {
    return (
      <div>
        Home Content
      </div>
    );
  }
}
