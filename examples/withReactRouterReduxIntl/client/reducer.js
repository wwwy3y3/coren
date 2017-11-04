const initialState = {
  albums: {
    isFetching: false,
    fetched: false,
    data: []
  },
  photos: {
    isFetching: false,
    fetched: false,
    data: []
  }
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'GET_ALBUMS':
      return {
        ...state,
        albums: {
          ...state.albums,
          isFetching: true
        }
      };
    case 'GET_ALBUMS_SUCCESS':
      return {
        ...state,
        albums: {
          isFetching: false,
          fetched: true,
          data: action.data
        }
      };

    case 'GET_PHOTO':
      return {
        ...state,
        photos: {
          ...state.photos,
          isFetching: true
        }
      };

    case 'GET_PHOTO_SUCCESS':
      return {
        ...state,
        photos: {
          ...state.photos,
          isFetching: false,
          fetched: true,
          data: action.data
        }
      };

    default:
      return state;
  }
}
module.exports = exports.default = reducer;
