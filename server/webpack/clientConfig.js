import webpack from 'webpack';
import {outputAssetDir} from '../CONFIG';
import AssetsPath from '../webpackPlugins/assets-path-plugin';

export default function createClientWebpackConfig({dir, dev = false, shareConfig, corenConfig}) {
  const assetsDir = outputAssetDir(dir);
  let plugins = [
    new AssetsPath({rootDir: dir}),
    new webpack.DefinePlugin({
      "process.env": {
        BROWSER: JSON.stringify(true)
      }
    })
  ];
  if (!dev) {
    plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        include: /\.min\.js$/,
        compress: {
          warnings: true
        }
      })
    );
  }
  const config = {
    ...shareConfig,
    entry: corenConfig.clientEntry,
    output: {
      path: assetsDir,
      filename: '[name].js'
    },
    plugins: [
      ...shareConfig.plugins,
      ...plugins
    ]
  };
  return webpack(config);
}
