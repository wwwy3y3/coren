import React, {Component} from 'react';
import Inner from './Inner';
import collector from '../../lib/client/collectorHoc';

@collector()
export default class Home extends Component {
  render() {
    return <div>
      <Inner />
    </div>;
  }
}
