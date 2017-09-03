import React, {Component, PropTypes} from 'react';
import {Provider, connect} from 'react-redux';
import {fetchAllUsers} from '../actions';
import {Link, StaticRouter} from 'react-router-dom';
import {ssr, head, route, wrapSSR, reduxStore, preloadedState} from 'coren';
import reducer from '../reducer';

@wrapSSR((appElement, config) => {
  const {route, reduxStore} = config;
  return (
    <Provider store={reduxStore}>
      <StaticRouter location={route.path}>
        {appElement}
      </StaticRouter>
    </Provider>
  );
})
@route('/users')
@reduxStore({reducer})
@preloadedState((props, options) => {
  const {context} = options;
  const {db} = context;
  return db.users.find().execAsync()
  .then(list => ({
    users: {
      list,
      fetched: true,
      isFetching: false,
      error: false
    }
  }));
})
@head({title: 'user list', description: 'user list'})
@ssr
@connect(mapStateToProps, mapDispatchToProps)
export default class UserList extends Component {
  static propTypes = {
    fetchAllUsers: PropTypes.func,
    users: PropTypes.object
  };

  componentDidMount() {
    const {users} = this.props;
    if (!users.fetched) {
      this.props.fetchAllUsers();
    }
  }

  render() {
    const {users} = this.props;
    if (users.fetched && users.error) {
      return <div>Error</div>;
    }

    if (users.isFetching) {
      return <div>loading</div>;
    }

    return (
        <div>
          <ul>
          {
            users.list.map(user =>
              <li><Link to={`/users/${user.id}`}>{user.id} {user.name}</Link></li>
            )
          }
          </ul>
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    users: state.users
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchAllUsers: () => dispatch(fetchAllUsers())
  };
}
