import {join} from 'path';
exports.clientTmpEntryDir = dir => {
  return join(dir, '.coren', 'tmp');
};
