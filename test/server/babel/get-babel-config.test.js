import {join} from 'path';
import getBabelConfig from '../../../server/babel/get-babel-config';
import defaultBabelrc from '../../../server/babel/default-babelrc';

describe('getBabelConfig', () => {
  it('withBabelrc', () => {
    const re = getBabelConfig(join(__dirname, '../testExample/withBabelrc'));
    expect(re).toEqual({babelrc: true});
  });

  it('withoutBabelrc', () => {
    const re = getBabelConfig(join(__dirname, '../testExample/withoutBabelrc'));
    expect(re).toEqual({
      babelrc: false,
      ...defaultBabelrc
    });
  });
});
