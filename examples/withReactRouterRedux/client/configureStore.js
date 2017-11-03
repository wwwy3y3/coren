import {createStore, applyMiddleware, compose} from 'redux';
import {apiMiddleware} from 'redux-api-middleware';
import {createLogger} from 'redux-logger';
import reducer from './reducer';

const createStoreWithMiddleware = (process.env.NODE_ENV === 'production') ?
compose(
  applyMiddleware(apiMiddleware)
)(createStore) :
compose(
  applyMiddleware(apiMiddleware),
  applyMiddleware(createLogger())
)(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(reducer, initialState);
}
