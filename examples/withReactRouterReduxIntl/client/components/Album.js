import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {FormattedMessage} from 'react-intl';
import {fetchPhoto} from '../actions';
import {Link} from 'react-router-dom';
import {ssr, headParams, routeParams, reactRouterReduxIntl, preloadedState} from 'coren';
import reducer from '../reducer';

@reactRouterReduxIntl({reducer})
@routeParams((props, context) => {
  const {albums} = context;
  return {
    url: '/:locale/album/:id',
    dataProvider: () => {
      const result = [];
      albums.forEach(album => {
        result.push({
          ...album,
          locale: 'en'
        });
        result.push({
          ...album,
          locale: 'zh'
        });
      });
      return Promise.resolve(result);
    }
  };
})
@preloadedState((props, options) => {
  const {context} = options;
  const {photos} = context;
  return Promise.resolve({
    photos: {
      data: photos,
      fetched: true,
      isFetching: false
    }
  });
})
@headParams(options => {
  const {context, route} = options;
  const {albums} = context;
  const albumId = route.data.id;
  const album = albums.filter(item => {
    return item.id === albumId;
  }).shift();
  return {
    title: album.title,
    description: album.title
  };
})
@ssr
@connect(mapStateToProps, mapDispatchToProps)
export default class Album extends Component {
  static propTypes = {
    fetchPhoto: PropTypes.func,
    photos: PropTypes.object
  };

  componentDidMount() {
    const {photos} = this.props;
    if (!photos.fetched) {
      this.props.fetchPhoto();
    }
  }

  render() {
    const {photos} = this.props;
    let {locale, id} = this.props.match.params;
    if (!photos.fetched || photos.isFetching) {
      return <div>loading</div>;
    }
    id = parseInt(id, 10);
    const {data} = photos;
    const albumPhoto = data.filter(item => {
      if (item.albumId === id) {
        return item;
      }
    });
    return (
        <div>
          <h2><FormattedMessage id="app.album.title"/></h2>
          <ul>
          {
            albumPhoto.map(photo =>
              <li><Link to={`/${locale}/photo/${photo.id}`}>{photo.title}</Link></li>
            )
          }
          </ul>
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    photos: state.photos
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchPhoto: () => dispatch(fetchPhoto())
  };
}
