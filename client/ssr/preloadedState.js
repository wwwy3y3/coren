import {ssrDecorator} from '../ssrHelper';

export default fn => {
  const name = 'preloadedState';
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

  return ssrDecorator(cycle);
};
