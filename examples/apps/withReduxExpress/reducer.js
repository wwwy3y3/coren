const initialState = {
  auth: false
};

module.exports = function reducer(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN':
      return {auth: true};
    case 'LOGOUT':
      return {auth: false};

    default:
      return state;
  }
}
