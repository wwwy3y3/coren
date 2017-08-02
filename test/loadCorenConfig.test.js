import {resolve} from 'path';
import loadCorenConfig, {defaultConfig} from '../src/loadCorenConfig';

it('loadCorenConfig', () => {
  const corenConfig = require('./testExample/coren.config');
  const re = loadCorenConfig(resolve('./test/testExample'));
  expect(re).toEqual(Object.assign({}, defaultConfig, corenConfig));
});
