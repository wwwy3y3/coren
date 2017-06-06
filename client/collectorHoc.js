import hoistStatic from 'hoist-non-react-statics';
import React from 'react';
import hook from '../server/componentHook';
import shortid from 'shortid';

export default function() {
  return WrappedComponent => {
    const uniqId = shortid.generate();
    hook.componentDidImport(uniqId, WrappedComponent);
    class Hoc extends React.Component {
      constructor(props) {
        super(props);
        hook.componentDidConstruct(uniqId, WrappedComponent);
      }

      render() {
        return <WrappedComponent {...this.props} />;
      }
    }
    return hoistStatic(Hoc, WrappedComponent);
  };
}
