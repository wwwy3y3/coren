import React, {Component} from 'react';
import collector from '../../lib/collectorHoc';

@collector()
export default class Inner extends Component {
  static defineHead() {
    return {
      title: "Inner",
      description: "Inner description"
    };
  }

  render() {
    return <div />;
  }
}
