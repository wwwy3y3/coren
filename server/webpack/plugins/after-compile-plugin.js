import {color} from '../../utils';
const {success} = color;
let emited = false;

export default class AfterCompile {
  apply(compiler) {
    compiler.plugin('done', () => {
      if (!emited) {
        if (process.env.NODE_ENV !== 'production') {
          // make compile finish message display at the end, so use setTimeOut to delay the output
          setTimeout(function() {
            console.log(success('Webpack has been completed. Run `coren dev` to build ssr.'));
          }, 600);
        }
        emited = true;
      }
    });
  }
}
