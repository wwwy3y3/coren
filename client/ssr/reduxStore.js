import {createStore} from 'redux';
import hook from '../../shared/ssrHook';

export default function({reducer}) {
  const name = 'reduxStore';

  const cycle = {
    name,
    setOptions: (props, options) => {
      const {preloadedState} = options;
      const store = createStore(reducer, preloadedState);
      return {reduxStore: store};
    }
  };

  return WrappedComponent => {
    hook.bindMethod(WrappedComponent.__COREN_ID(), cycle);
  };
}
