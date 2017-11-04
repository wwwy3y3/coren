import {join} from 'path';
import mkdirp from 'mkdirp';

exports.initialize = dir => {
  const dirs = [
    join(dir, '.coren', 'commonjs'),
    join(dir, '.coren', 'html')
  ];
  dirs.forEach(d => mkdirp.sync(d));
};
// .coren
exports.getRootPath = dir => {
  return join(dir, '.coren');
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
