import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {FormattedMessage} from 'react-intl';
import {fetchAlbums} from '../actions';
import {Link} from 'react-router-dom';
import {ssr, headParams, routeParams, reactRouterReduxIntl, preloadedState} from 'coren';
import reducer from '../reducer';

@reactRouterReduxIntl({reducer})
@routeParams(() => {
  return {
    url: '/:locale',
    dataProvider: () => {
      return Promise.resolve([
        {locale: 'en'},
        {locale: 'zh'}
      ]);
    }
  };
})
@preloadedState((props, options) => {
  const {context} = options;
  const {albums} = context;
  return Promise.resolve({
    albums: {
      data: albums,
      fetched: true,
      isFetching: false
    }
  });
})
@headParams(config => {
  const {route} = config;
  const locale = route.data.locale;
  if (locale === 'en') {
    return {
      title: 'Album List',
      description: 'album list desc'
    };
  } else if (locale === 'zh') {
    return {
      title: '相簿列表',
      description: '相簿列表描述'
    };
  }
})
@ssr
@connect(mapStateToProps, mapDispatchToProps)
export default class UserList extends Component {
  static propTypes = {
    fetchAlbums: PropTypes.func,
    albums: PropTypes.object
  };

  componentDidMount() {
    const {albums} = this.props;
    if (!albums.fetched) {
      this.props.fetchAlbums();
    }
  }

  render() {
    const {locale} = this.props.match.params;
    const {albums} = this.props;
    if (!albums.fetched || albums.isFetching) {
      return <div>loading</div>;
    }

    return (
        <div>
          <h1><FormattedMessage id="app.album.title" defaultMessage="Hello World!" description="Hello world header greeting"/></h1>
          <ul>
          {
            albums.data.map(album =>
              <li><Link to={`/${locale}/album/${album.id}`}>{album.title}</Link></li>
            )
          }
          </ul>
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    albums: state.albums
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchAlbums: () => dispatch(fetchAlbums())
  };
}
