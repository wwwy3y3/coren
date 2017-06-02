import hoistStatic from 'hoist-non-react-statics';
import React from 'react';
import collectorManager from '../server/singletonCollectorManager';
import shortid from 'shortid';

export default function() {
  return WrappedComponent => {
    const uniqId = shortid.generate();
    collectorManager.componentDidImport(uniqId, WrappedComponent);
    class Hoc extends React.Component {
      constructor(props) {
        super(props);
        collectorManager.componentDidConstruct(uniqId, WrappedComponent);
      }

      render() {
        return <WrappedComponent />;
      }
    }
    return hoistStatic(Hoc, WrappedComponent);
  };
}
