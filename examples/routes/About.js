import React, {Component} from 'react';
import Inner from './Inner';
import collector from '../../lib/client/collectorHoc';

@collector()
export default class About extends Component {
  static defineHead() {
    return {
      title: "about",
      description: "description"
    };
  }

  static defineRoutes({Url}) {
    return new Url('/about');
  }

  static defineStyle() {
    return "https://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.3/normalize.min.css";
  }

  static defineScript() {
    return "https://www.google.com/recaptcha/api.js";
  }

  render() {
    return <div>
      <Inner />
      <Inner />
    </div>;
  }
}
