import React, {Component} from 'react';
import {collector} from 'coren';
// import collector from 'coren/lib/client/collectorHoc';

@collector()
export default class Root extends Component {
  static defineHead() {
    return {
      title: "home",
      description: "home description"
    };
  }

  static defineRoutes({Url}) {
    return new Url('/');
  }

  render() {
    return (
        <div>
          Home Contentss
        </div>
    );
  }
}
