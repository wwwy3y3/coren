import webpack from 'webpack';
import {resolve} from 'path';
import nodeExternals from 'webpack-node-externals';
import getBabelConfig from '../babel/get-babel-config';
import {getCommonJSDir} from '../coren-working-space';

export default function serverClientWebpackConfig({dev = false, dir, corenConfig}) {
  const env = dev ? 'development' : 'production';
  let config = {
    entry: corenConfig.entry,
    target: 'node',
    output: {
      path: getCommonJSDir(dir),
      filename: '[name].commonjs2.js',
      libraryTarget: 'commonjs2'
    },
    resolve: {
      extensions: ['.js']
    },
    externals: [
      nodeExternals(),
      /^(coren|\$)$/i
    ],
    plugins: [
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify(env)
        }
      })
    ],
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
  if (corenConfig.ssrWebpack) {
    if (corenConfig.ssrWebpack.plugins) {
      config = {
        ...config,
        plugins: [
          ...config.plugins,
          ...corenConfig.ssrWebpack.plugins
        ]
      };
    }

    if (corenConfig.ssrWebpack.module && corenConfig.ssrWebpack.module.rules) {
      config = {
        ...config,
        module: {
          rules: [
            ...config.module.rules,
            ...corenConfig.ssrWebpack.module.rules
          ]
        }
      };
    }
    if (corenConfig.ssrWebpack.externals) {
      config = {
        ...config,
        externals: [
          ...config.externals,
          ...corenConfig.ssrWebpack.externals
        ]
      };
    }
  }
  return webpack(config);
}
