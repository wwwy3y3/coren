import React, {Component} from 'react';
import collector from '../../lib/client/collectorHoc';

@collector()
export default class Inner extends Component {
  static definePreloadedState({db}) {
    return {latestPosts: db.fetch('posts').limit(10)};
  }

  render() {
    return <div />;
  }
}
