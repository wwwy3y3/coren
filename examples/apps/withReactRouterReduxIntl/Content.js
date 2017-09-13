import React, {Component} from 'react';
import {IntlProvider, FormattedMessage} from 'react-intl';
import {ssr, routeParams, headParams, wrapDOM, wrapSSR} from 'coren';
import localeData from './locales/data.json';

@headParams(config => {
  const {route} = config;
  const locale = route.data.locale;
  if (locale === 'en') {
    return {
      title: 'home',
      description: 'home description'
    };
  } else if (locale === 'zh') {
    return {
      title: '首頁',
      description: '首頁描述'
    };
  }
})
@routeParams(props => {
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
@wrapSSR((appElement, options) => {
  const {route} = options;
  const locale = route.data.locale;

  return (
    <IntlProvider locale={locale} messages={localeData[locale]}>
      {appElement}
    </IntlProvider>
  );
})
@wrapDOM(({children}) => {
  return (
    <IntlProvider locale="en">
      {children}
    </IntlProvider>
  );
})
@ssr
export default class Root extends Component {
  render() {
    return (
      <div>
        <h1><FormattedMessage id="hi" defaultMessage="Hello World!" description="Hello world header greeting"/></h1>
      </div>
    );
  }
}
