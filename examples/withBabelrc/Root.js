import React, {Component} from 'react';
import {ssr, route} from 'coren';

@route('/')
@ssr
export default class Root extends Component {
  render() {
    return (
      <div>root test</div>
    );
  }
}
