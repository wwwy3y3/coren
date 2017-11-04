import {ssrDecorator} from '../ssrHelper';

export default wrapFn => {
  const name = 'wrapSSR';

  const cycle = {
    name,
    wrapSSR: (appElement, options) => {
      return wrapFn(appElement, options);
    }
  };

  return ssrDecorator(cycle);
};
