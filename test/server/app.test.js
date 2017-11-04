const path = require('path');
const App = require('../../server/app');
const componentPath = path.resolve('./test/server/testExample/component');

describe('App', () => {
  it('test hook', () => {
    const app = new App({path: componentPath});
    console.log(app.getMethod());
  });
});
