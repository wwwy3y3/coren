import React, {Component} from 'react';
import Inner from './Inner';
import collector from '../../lib/client/collectorHoc';

@collector()
export default class Home extends Component {
  static defineHead() {
    return {
      title: "Home",
      description: "Home description"
    };
  }

  render() {
    return <div>
      <Inner />
    </div>;
  }
}
