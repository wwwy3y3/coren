import hook from '../../shared/ssrHook';

export default headParamsFn => {
  return WrappedComponent => {
    const name = 'headParams';
    const cycle = {
      name,
      appendToHead: ($head, options) => {
        const {title, description} = headParamsFn(options);
        $head.append(`<title>${title}</title>`);
        $head.append(`<meta name="description" content="${description}">`);
      }
    };

    hook.bindMethod(WrappedComponent.__COREN_ID(), cycle);
  };
};
