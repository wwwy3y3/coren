import {ssrDecorator} from '../ssrHelper';

export default headParamsFn => {
  const name = 'headParams';
  const cycle = {
    name,
    appendToHead: ($head, options) => {
      const {title, description} = headParamsFn(options);
      $head.append(`<title>${title}</title>`);
      $head.append(`<meta name="description" content="${description}">`);
    }
  };

  return ssrDecorator(cycle);
};
