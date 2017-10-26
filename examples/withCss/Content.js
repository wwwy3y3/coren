import React, {Component} from 'react';
import {ssr, route, head} from 'coren';
import './style.css';

@head({title: "home", description: "home description"})
@route('/')
@ssr
export default class Root extends Component {
  render() {
    return (
      <div>
        <h1 className="red">Click the button!</h1>
        <button className="hi" onClick={this.handleClick}>index file!</button>
      </div>
    );
  }
}
