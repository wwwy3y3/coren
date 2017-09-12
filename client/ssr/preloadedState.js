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
      const {preloadedState, initialState} = options;
      let state = preloadedState;
      if (initialState) {
        state = Object.assign({}, initialState, preloadedState);
      }
      $head.append(`<script data-coren>
        window.__PRELOADED_STATE__ = ${JSON.stringify(state)}
        </script>`);
    }
  };

  return ssrDecorator(cycle);
};
