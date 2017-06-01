import React, {Component} from 'react';
import Inner from './inner';
import collector from '../../lib/collectorHoc';

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
