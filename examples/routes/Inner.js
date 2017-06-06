import React, {Component} from 'react';
import collector from '../../lib/collectorHoc';

@collector()
export default class Inner extends Component {
  render() {
    return <div />;
  }
}
