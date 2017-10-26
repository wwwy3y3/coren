import {createStore, applyMiddleware, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger';
import reducer from './reducer';

const createStoreWithMiddleware = (process.env.NODE_ENV === 'production') ?
compose(
  applyMiddleware(thunkMiddleware)
)(createStore) :
compose(
  applyMiddleware(thunkMiddleware),
  applyMiddleware(createLogger())
)(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(reducer, initialState);
}
