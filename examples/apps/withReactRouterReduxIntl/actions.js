import fetch from 'isomorphic-fetch';

const GET_ALBUMS = 'GET_ALBUMS';
const GET_ALBUMS_SUCCESS = 'GET_ALBUMS_SUCCESS';
const GET_PHOTO = 'GET_PHOTO';
const GET_PHOTO_SUCCESS = 'GET_PHOTO_SUCCESS';

const getAlbums = () => {
  return {
    type: GET_ALBUMS
  };
};

const getAlbumsSuccess = data => {
  return {
    type: GET_ALBUMS_SUCCESS,
    data
  };
};

const getPhoto = () => {
  return {
    type: GET_PHOTO
  };
};

const getPhotoSuccess = data => {
  return {
    type: GET_PHOTO_SUCCESS,
    data
  };
};

export function fetchAlbums() {
  return dispatch => {
    dispatch(getAlbums);
    return fetch("http://jsonplaceholder.typicode.com/albums")
            .then(resp => resp.json())
            .then(json => {
              json = json.filter(item => {
                return item.id <= 2;
              });
              dispatch(getAlbumsSuccess(json));
            });
  };
}

export function fetchPhoto() {
  return dispatch => {
    dispatch(getPhoto);
    return fetch(`http://jsonplaceholder.typicode.com/photos`)
            .then(resp => resp.json())
            .then(json => {
              json = json.filter(item => {
                return item.albumId <= 2;
              });
              dispatch(getPhotoSuccess(json));
            });
  };
}
