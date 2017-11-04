import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {fetchAllUsers} from '../actions';
import {Link} from 'react-router-dom';
import {ssr, head, route, reactRouterRedux, preloadedState} from 'coren';
import reducer from '../reducer';

@reactRouterRedux({reducer})
@route('/users')
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
