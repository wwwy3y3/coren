import {createStore} from 'redux';
import hook from '../../shared/ssrHook';

export default function({reducer}) {
  const name = 'reduxStore';

  const cycle = {
    name,
    setOptions: (props, options) => {
      let store;
      if (options.preloadedState) {
        const {preloadedState} = options;
        store = createStore(reducer, preloadedState);
      } else {
        store = createStore(reducer);
      }
      return {reduxStore: store};
    }
  };

  return WrappedComponent => {
    hook.bindMethod(WrappedComponent.__COREN_ID(), cycle);
  };
}
