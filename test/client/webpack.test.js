const CorenWebpack = require('../../client/webpack');
const webpackConfig = require('./webpack.config.pure');

describe('CorenWebpack', () => {
  it('test return', () => {
    const corenWebapck = new CorenWebpack(__dirname, webpackConfig);
    console.log(corenWebapck.userWebpack.module);
  });
});
