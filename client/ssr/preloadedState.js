import hook from '../../shared/ssrHook';

export default fn => {
  const name = 'preloadedState';
  return WrappedComponent => {
    const cycle = {
      name,
      setOptions: async (props, options) => {
        const data = await fn(props, options);
        return {preloadedState: data};
      },
      appendToHead: ($head, options) => {
        const {preloadedState} = options;
        $head.append(`<script data-coren>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)}
          </script>`);
      }
    };

    hook.bindMethod(WrappedComponent.__COREN_ID(), cycle);
  };
};
