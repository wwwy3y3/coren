import React, {Component} from 'react';
import Inner from './Inner';
import collector from '../../lib/client/collectorHoc';

@collector()
export default class About extends Component {
  static definePreloadedState({db}) {
    return db.fetch('about').exec()
    .then(data => ({about: data}));
  }

  render() {
    return <div>
      <Inner />
      <Inner />
    </div>;
  }
}
