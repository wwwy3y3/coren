import {resolve} from 'path';
import loadCorenConfig, {defaultConfig} from '../server/loadCorenConfig';

it('loadCorenConfig', () => {
  const corenConfig = require('./testExample/coren.config');
  const re = loadCorenConfig(resolve('./test/testExample'));
  expect(re).toEqual(Object.assign({}, defaultConfig, corenConfig));
});
