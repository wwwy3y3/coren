import React, {Component} from 'react';
import {ssr, head, route, wrapSSR} from 'coren';
import {StaticRouter} from 'react-router-dom';

@wrapSSR(appElement => {
  return (
    <StaticRouter>
      {appElement}
    </StaticRouter>
  );
})
@route('/')
@head({title: 'home', description: 'home description'})
@ssr
export default class Root extends Component {

  render() {
    return (
      <div>
        Home Content
      </div>
    );
  }
}
