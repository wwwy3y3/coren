import React, {Component} from 'react';
import {ssr, route, head} from 'coren';
import CSSModules from 'react-css-modules';
import styles from './style.css';

@route('/')
@head({title: "home", description: "home description"})
@ssr
@CSSModules(styles)
export default class Root extends Component {
  handleClick() {
    console.log('hihi');
  }

  render() {
    return (
      <div>
        <h1 styleName="red">use react-css-modules!</h1>
        <button styleName="hi" onClick={this.handleClick}>index file!</button>
      </div>
    );
  }
}
