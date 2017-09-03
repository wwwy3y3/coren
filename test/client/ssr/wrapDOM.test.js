import React, {Component} from 'react';
import wrapDOM from '../../../client/ssr/wrapDOM';
import {mount} from 'enzyme';

@wrapDOM(({children}) => {
  return <div id="hi">{children}</div>;
})
class Test extends Component {
  render() {
    return <div>hi</div>;
  }
}
// Test.corenBind();
describe('ssr warp dom', () => {
  it('wrap dom', () => {
    console.log(mount(<Test/>).html());
  });
});
