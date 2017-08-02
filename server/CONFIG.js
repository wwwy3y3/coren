import {join} from 'path';
exports.wrappedEntryDir = dir => {
  return join(dir, '.coren', 'tmp');
};
