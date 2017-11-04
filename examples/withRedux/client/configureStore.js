import {createStore, applyMiddleware, compose} from 'redux';
import reducer from './reducer';

const createStoreWithMiddleware = compose(
  applyMiddleware()
)(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(reducer, initialState);
}
