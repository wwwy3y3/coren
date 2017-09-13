import React, {Component} from 'react';
import {ssr, head, route} from 'coren';

@route('/about')
@head({title: 'About', description: 'About description'})
@ssr
export default class Root extends Component {
  render() {
    return (
      <div>
        <a href="/">Home</a>
        About Content
      </div>
    );
  }
}
