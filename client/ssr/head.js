import hook from '../../shared/ssrHook';

export default function({title, description}) {
  const name = 'head';

  const cycle = {
    name,
    appendToHead: $head => {
      $head.append(`<title>${title}</title>`);
      $head.append(`<meta name="description" content="${description}">`);
    }
  };

  return WrappedComponent => {
    hook.bindMethod(WrappedComponent.__COREN_ID(), cycle);
  };
}
