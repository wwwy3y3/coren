import {CALL_API} from 'redux-api-middleware';

const GET_USER = [
  'GET_USER',
  'GET_USER_SUCCESS',
  'GET_USER_FAILURE'
];

const GET_ALL_USERS = [
  'GET_ALL_USERS',
  'GET_ALL_USERS_SUCCESS',
  'GET_ALL_USERS_FAILURE'
];

export function fetchUser(userId) {
  return {[CALL_API]: {
    types: GET_USER,
    endpoint: `http://jsonplaceholder.typicode.com/users/${userId}`,
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }};
}

export function fetchAllUsers() {
  return {[CALL_API]: {
    types: GET_ALL_USERS,
    endpoint: 'http://jsonplaceholder.typicode.com/users',
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }};
}
