import ora from 'ora';
import logSymbols from 'log-symbols';
import webpack from './webpack';
import loadCorenConfig from './load-coren-config';
import {color} from './utils';
const {error} = color;

const runWebpack = (compiler, msg) => {
  return () => {
    const spinner = ora(msg).start();
    return new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        if (err) {
          return reject(err);
        }

        const jsonStats = stats.toJson();

        if (jsonStats.errors.length > 0) {
          const error = new Error(jsonStats.errors[0]);
          error.errors = jsonStats.errors;
          error.warnings = jsonStats.warnings;
          return reject(error);
        }
        spinner.stopAndPersist({
          symbol: logSymbols.success,
          text: msg
        });
        resolve(jsonStats);
      });
    });
  };
};

export default function build({dir, env, clientWebpackPath}) {
  const dev = env !== 'production';
  const config = loadCorenConfig(dir);
  const {clientCompiler, serverCompiler} = webpack({dir, corenConfig: config, dev, clientWebpackPath});
  const runServerWebpack = runWebpack(serverCompiler, 'Building server side webpack');

  return runServerWebpack()
          .then(() => {
            if (!dev) {
              return runWebpack(clientCompiler, 'Building client side webpack')();
            }
          })
          .catch(err => {
            throw new Error(error(err));
          });
}
