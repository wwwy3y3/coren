import React, {Component} from 'react';
import collector from '../../lib/client/collectorHoc';

@collector()
export default class Inner extends Component {
  static definePreloadedState({db}) {
    return db.fetch('posts').limit(10).exec()
    .then(data => ({latestPosts: data}));
  }

  render() {
    return <div />;
  }
}
