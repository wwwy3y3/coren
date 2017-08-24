import React, {Component} from 'react';
import {collector} from 'coren';
import './style.css';

@collector()
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
        <h1 className="red">Click the button!</h1>
        <button className="hi" onClick={this.handleClick}>index file!</button>
      </div>
    );
  }
}
