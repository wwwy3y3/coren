import React from 'react';
import hoistStatic from 'hoist-non-react-statics';
import shortid from 'shortid';
import hook from '../../shared/ssrHook';

export default function(WrappedComponent) {
  const corenID = shortid.generate();
  class Hoc extends React.Component {
    constructor(props) {
      super(props);
      hook.setProps(corenID, props);
    }

    static __COREN_ID() {
      return corenID;
    }

    render() {
      return (
        <WrappedComponent {...this.props}/>
      );
    }
  }
  const HoistComponent = hoistStatic(Hoc, WrappedComponent);
  hook.registerComponent(corenID, HoistComponent);
  return HoistComponent;
}
