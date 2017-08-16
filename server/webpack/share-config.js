import {resolve} from 'path';
import webpack from 'webpack';
import getBabelConfig from '../babel/get-babel-config';

export default function createShareConfig({dir, dev = false, corenConfig}) {
  const env = dev ? 'development' : 'production';
  // setup plugins
  const plugins = [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(env)
      }
    })
  ];
  let config = {
    // target: 'node',
    resolve: {
      extensions: ['.js']
    },
    plugins: plugins,
    externals: [],
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
  };
  if (corenConfig.webpack) {
    if (corenConfig.webpack.plugins) {
      config = {
        ...config,
        plugins: [
          ...config.plugins,
          ...corenConfig.webpack.plugins
        ]
      };
    }

    if (corenConfig.webpack.module && corenConfig.webpack.module.rules) {
      config = {
        ...config,
        module: {
          rules: [
            ...config.module.rules,
            ...corenConfig.webpack.module.rules
          ]
        }
      };
    }
    if (corenConfig.webpack.externals) {
      config = {
        ...config,
        externals: [
          ...config.externals,
          ...corenConfig.webpack.externals
        ]
      };
    }
  }
  return config;
}
