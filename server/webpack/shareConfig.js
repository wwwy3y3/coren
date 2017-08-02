import {resolve} from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import getBabelConfig from '../babel/getBabelConfig';

const extractCSS = new ExtractTextPlugin({
  filename: 'css/[name].css',
  allChunks: true
});

export default function createShareConfig({dir, dev = false, corenConfig}) {
  const env = dev ? 'development' : 'production';
  // setup plugins
  const plugins = [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(env)
      }
    }),
    extractCSS
  ];
  let config = {
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
        },
        {
          test: /\.css$/,
          use: extractCSS.extract(["css-loader?minimize"])
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
    if (corenConfig.webpack.rules) {
      config = {
        ...config,
        module: {
          rules: [
            ...config.module.rules,
            ...corenConfig.webpack.rules
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
