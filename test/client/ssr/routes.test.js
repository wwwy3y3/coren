import React, {Component} from 'react';
import route from '../../../client/ssr/route';
import ssr from '../../../client/ssr/ssr';
import {render} from 'enzyme';

@route('/home')
@ssr
class Test extends Component {
  render() {
    return <div>hi</div>;
  }
}
// Test.corenBind();
describe('ssr route', () => {
  it('test wrap', () => {
    console.log(render(<Test/>));
  });
});
