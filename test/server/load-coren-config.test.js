import {resolve} from 'path';
import loadCorenConfig, {defaultConfig} from '../../server/load-coren-config';

it('loadCorenConfig', () => {
  const corenConfig = require('./testExample/withBabelrc/coren.config');
  const re = loadCorenConfig(resolve('./test/server/testExample/withBabelrc'));
  expect(re).toEqual(Object.assign({}, defaultConfig, corenConfig));
});
