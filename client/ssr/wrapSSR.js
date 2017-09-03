import hook from '../../shared/ssrHook';

export default wrapFn => {
  const name = 'wrapSSR';

  const cycle = {
    name,
    wrapSSR: (appElement, options) => {
      return wrapFn(appElement, options);
    }
  };

  return WrappedComponent => {
    hook.bindMethod(WrappedComponent.__COREN_ID(), cycle);
  };
};
