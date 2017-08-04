import immutable, {Map, List} from 'immutable';
const initialState = new Map({
  users: new Map({
    list: new List(),
    isFetching: false,
    fetched: false,
    error: false
  }),
  currentUser: new Map({
    data: new Map(),
    isFetching: false,
    fetched: false,
    error: false
  })
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'GET_ALL_USERS':
      return state
              .setIn(['users', 'isFetching'], true);

    case 'GET_ALL_USERS_SUCCESS':
      return state
              .setIn(['users', 'list'], immutable.fromJS(action.payload))
              .setIn(['users', 'fetched'], true)
              .setIn(['users', 'isFetching'], false);

    case 'GET_ALL_USERS_FAILURE':
      return state
              .setIn(['users', 'fetched'], true)
              .setIn(['users', 'error'], true);

    case 'GET_USER':
      return state
              .setIn(['currentUser', 'isFetching'], true);

    case 'GET_USER_SUCCESS':
      return state
              .setIn(['currentUser', 'data'], immutable.fromJS(action.payload))
              .setIn(['currentUser', 'fetched'], true)
              .setIn(['currentUser', 'isFetching'], false);

    case 'GET_USER_FAILURE':
      return state
              .setIn(['currentUser', 'fetched'], true)
              .setIn(['currentUser', 'error'], true);

    default:
      return state;
  }
}
