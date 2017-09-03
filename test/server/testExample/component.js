import React, {Component} from 'react';
import head from '../../../client/ssr/head';
import ssr from '../../../client/ssr/ssr';

@head({title: 'hi3'})
@ssr
export default class Test extends Component {
  render() {
    return <div>hi</div>;
  }
}
