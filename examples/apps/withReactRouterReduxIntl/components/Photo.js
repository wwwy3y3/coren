import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {FormattedMessage} from 'react-intl';
import {Link} from 'react-router-dom';
import {ssr, headParams, routeParams, reactRouterReduxIntl, preloadedState} from 'coren';
import reducer from '../reducer';
import {fetchPhoto} from '../actions';

@reactRouterReduxIntl({reducer})
@routeParams((props, context) => {
  const {photos} = context;
  return {
    url: '/:locale/photo/:id',
    dataProvider: () => {
      const result = [];
      photos.forEach(photo => {
        result.push({
          ...photo,
          locale: 'en'
        });
        result.push({
          ...photo,
          locale: 'zh'
        });
      });
      return Promise.resolve(result);
    }
  };
})
@headParams(options => {
  const {context, route} = options;
  const {photos} = context;
  const photoId = route.data.id;
  const photo = photos.filter(item => {
    return item.id === photoId;
  }).shift();
  return {
    title: photo.title,
    description: photos.title
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
@ssr
@connect(mapStateToProps, mapDispatchToProps)
export default class Photo extends Component {
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
      if (item.id === id) {
        return item;
      }
    }).shift();

    return (
      <div>
        <Link to={`/${locale}/album/${albumPhoto.albumId}`}>Back to album {albumPhoto.albumId}</Link>
        <h2><FormattedMessage id="app.photo.title"/></h2>
        <img src={albumPhoto.thumbnailUrl} alt=""/>
        <p>{albumPhoto.title}</p>
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
