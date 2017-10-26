import React, {Component} from 'react';
import {ssr, route} from 'coren';

@route('/root2')
@ssr
export default class Root2 extends Component {
  render() {
    return (
      <div>root2 test</div>
    );
  }
}
