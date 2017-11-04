import {ssrDecorator} from '../ssrHelper';

export default ({title, description}) => {
  const name = 'head';

  const cycle = {
    name,
    appendToHead: $head => {
      $head.append(`<title>${title}</title>`);
      $head.append(`<meta name="description" content="${description}">`);
    }
  };
  return ssrDecorator(cycle);
};
