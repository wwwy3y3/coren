import React, {Component} from 'react';
import Inner from './inner';
import collector from '../../lib/collectorHoc';

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
