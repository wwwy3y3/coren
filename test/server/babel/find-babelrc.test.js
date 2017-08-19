import findBabelrc from '../../../server/babel/find-babelrc';
import {join} from 'path';

describe('findBabelrc', () => {
  it('with babel', () => {
    const re = findBabelrc(join(__dirname, '../testExample/withBabelrc'));
    expect(Boolean(re)).toBe(true);
  });

  it('without babelrc', () => {
    const re = findBabelrc(join(__dirname, '../testExample/withoutBabelrc'));
    expect(Boolean(re)).toBe(false);
  });
});
