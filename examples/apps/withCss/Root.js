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

  render() {
    return (
      <div className="hi">root test yoyooyoyo</div>
    );
  }
}
