import React, {Component} from 'react';
import Inner from './Inner';
import collector from '../../lib/client/collectorHoc';

@collector()
export default class About extends Component {
  static definePreloadedState({db}) {
    return {about: db.fetch('about')};
  }

  render() {
    return <div>
      <Inner />
      <Inner />
    </div>;
  }
}
