import React, {Component, PropTypes} from 'react';
import collector from '../../lib/collectorHoc';

@collector()
export default class Product extends Component {
  static defineHead() {
    return {
      title: "product",
      description: "product"
    };
  }

  static defineRoutes({ParamUrl, db}) {
    return new ParamUrl({
      url: '/products/:id',
      dataProvider: () => db.fetch('products').exec()
    });
  }

  static propTypes = {
    match: PropTypes.object
  };

  render() {
    const productId = (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id) ?
    this.props.match.params.id :
    null;

    return <div>product: {productId}</div>;
  }
}
