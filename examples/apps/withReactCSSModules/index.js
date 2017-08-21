import React, {Component} from 'react';
import {collector} from 'coren';
import CSSModules from 'react-css-modules';
import styles from './style.css';

@collector()
@CSSModules(styles)
export default class Root extends Component {
  static defineHead() {
    return {
      title: "home",
      description: "home description"
    };
  }

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
