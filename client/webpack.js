import {resolve} from 'path';
import merge from 'webpack-merge';
import getBabelConfig from '../server/babel/get-babel-config';
import loadCorenConfig from '../server/load-coren-config';
import AssetsPathPlugin from '../server/webpack/plugins/assets-path-plugin';
import AfterCompilePlugin from '../server/webpack/plugins/after-compile-plugin';

export default class CorenWebpack {
  constructor(dir, userWebpack) {
    this.userWebpack = userWebpack;
    this.corenConfig = loadCorenConfig(dir);

    this.userWebpack.plugins = [
      new AssetsPathPlugin({rootDir: dir}),
      new AfterCompilePlugin(),
      ...this.userWebpack.plugins
    ];
    this.userWebpack = merge(this.userWebpack, {
      module: {
        rules: [
          {
            test: /\.js$/,
            use: {
              loader: 'babel-loader',
              options: getBabelConfig(dir)
            },
            exclude: resolve(dir, "node_modules")
          }
        ]
      }
    });
  }

  output() {
    return this.userWebpack;
  }
}
