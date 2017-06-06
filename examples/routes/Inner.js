import React, {Component} from 'react';
import collector from '../../lib/client/collectorHoc';

@collector()
export default class Inner extends Component {
  render() {
    return <div />;
  }
}
