import {resolve} from 'path';
import loadCorenConfig, {defaultConfig} from '../server/loadCorenConfig';

it('loadCorenConfig', () => {
  const corenConfig = require('./testExample/withBabelrc/coren.config');
  const re = loadCorenConfig(resolve('./test/testExample/withBabelrc'));
  expect(re).toEqual(Object.assign({}, defaultConfig, corenConfig));
});
