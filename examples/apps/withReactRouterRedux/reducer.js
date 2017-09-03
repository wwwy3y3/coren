const initialState = {
  users: {
    list: [],
    isFetching: false,
    fetched: false,
    error: false
  },
  currentUser: {
    data: {},
    isFetching: false,
    fetched: false,
    error: false
  }
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'GET_ALL_USERS':
      return Object.assign({}, state, {
        users: Object.assign({}, state.users, {isFetching: true})
      });

    case 'GET_ALL_USERS_SUCCESS':
      return Object.assign({}, state, {
        users: Object.assign({}, state.users, {
          list: action.payload,
          fetched: true,
          isFetching: false
        })
      });

    case 'GET_ALL_USERS_FAILURE':
      return Object.assign({}, state, {
        users: Object.assign({}, state.users, {
          fetched: true,
          error: true
        })
      });

    case 'GET_USER':
      return Object.assign({}, state, {
        currentUser: Object.assign({}, state.currentUser, {
          isFetching: true
        })
      });

    case 'GET_USER_SUCCESS':
      return Object.assign({}, state, {
        currentUser: Object.assign({}, state.currentUser, {
          data: action.payload,
          fetched: true,
          isFetching: false
        })
      });

    case 'GET_USER_FAILURE':
      return Object.assign({}, state, {
        currentUser: Object.assign({}, state.currentUser, {
          fetched: true,
          error: true
        })
      });

    default:
      return state;
  }
}

module.exports = exports.default = reducer;
