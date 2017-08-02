import {resolve} from 'path';
import getBabelConfig from '../../src/babel/getBabelConfig';
import defaultBabelrc from '../../src/babel/defaultBabelrc';

describe('getBabelConfig', () => {
  it('withBabelrc', () => {
    const re = getBabelConfig(resolve('./test/examples/withBabelrc'));
    expect(re).toEqual({babelrc: true});
  });

  it('withoutBabelrc', () => {
    const re = getBabelConfig(resolve('./test/examples/withoutBabelrc'));
    expect(re).toEqual({
      babelrc: false,
      ...defaultBabelrc
    });
  });
});
