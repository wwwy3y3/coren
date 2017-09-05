import hook from '../shared/ssrHook';
exports.ssrDecorator = cycle => {
  return WrappedComponent => {
    hook.bindMethod(WrappedComponent.__COREN_ID(), cycle);
    return WrappedComponent;
  };
};
