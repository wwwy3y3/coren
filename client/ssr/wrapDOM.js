import React from 'react';
import hoistStatic from 'hoist-non-react-statics';

export default Wrapper => {
  return WrappedComponent => {
    if (process.env.isBrowser) {
      class Hoc extends React.Component {
        render() {
          return (
            <Wrapper {...this.props}>
              <WrappedComponent/>
            </Wrapper>
          );
        }
      }

      return hoistStatic(Hoc, WrappedComponent);
    }

    console.warn('Because `process.env.isBrowser` is false, wrapDOM will not work');
    return WrappedComponent;
  };
};
