import webpack from './webpack';
import loadCorenConfig from './loadCorenConfig';
import {addClientEntry, createClientTmpEntryFile} from './clientEntry';

export default function build(dir) {
  const config = loadCorenConfig(dir);
  const updatedCorenConfig = addClientEntry(dir, config);
  const {clientCompiler, serverCompiler} = webpack({dir, corenConfig: updatedCorenConfig});
  return new Promise((resolve, reject) => {
    // run server webpack & client webpack
    serverCompiler.run((err, stats) => {
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
      // after server webpack compiled, load commonjs2 to collect client needed information
      createClientTmpEntryFile(dir, updatedCorenConfig);
      clientCompiler.run((err, stats) => {
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
        resolve(jsonStats);
      });
    });
  });
}
