import React, {Component} from 'react';
import Inner from './Inner';
import collector from '../../lib/client/collectorHoc';

@collector()
export default class About extends Component {
  static defineHead() {
    return {
      title: "about",
      description: "description"
    };
  }

  render() {
    return <div>
      <Inner />
      <Inner />
    </div>;
  }
}
