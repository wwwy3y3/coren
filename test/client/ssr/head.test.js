import React, {Component} from 'react';
import head from '../../../client/ssr/head';
import ssr from '../../../client/ssr/ssr';
import {render} from 'enzyme';

@head({title: 'hi3'})
@ssr
class Test extends Component {
  render() {
    return <div>hi</div>;
  }
}
// Test.corenBind();
describe('ssr head', () => {
  it('test wrap', () => {
    console.log(render(<Test/>));
  });
});
