import {join} from 'path';
import mkdirp from 'mkdirp';

exports.initialize = dir => {
  const dirs = [
    join(dir, '.coren', 'tmp'),
    join(dir, '.coren', 'commonjs'),
    join(dir, '.coren', 'html')
  ];
  dirs.forEach(d => mkdirp.sync(d));
};
// .coren
exports.getRootPath = dir => {
  return join(dir, '.coren');
};

exports.getClientTmpEntryDir = dir => {
  return join(dir, '.coren', 'tmp');
};

exports.getAssetsJsonPath = dir => {
  return join(dir, '.coren', 'assets.json');
};

exports.getSsrDir = dir => {
  return join(dir, '.coren', 'html');
};

exports.getCommonJSDir = dir => {
  return join(dir, '.coren', 'commonjs');
};

exports.getEnv = () => {
  if (process.env.COREN_ENV) {
    return process.env.COREN_ENV;
  }
  if (process.env.NODE_ENV === 'development') {
    return 'development';
  }
  return 'production';
};

exports.preserveEntry = ['$vendor'];
