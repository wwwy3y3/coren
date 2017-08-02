import getBabelrc from '../../src/babel/getBabelrc';

it('getBabelrc', () => {
  const re = getBabelrc('./testExample/component');
  console.log(re);
});
