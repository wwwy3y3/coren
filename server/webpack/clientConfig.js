import webpack from 'webpack';
import {join} from 'path';
import AssetsPath from '../plugins/assets-path-plugin';

export default function createClientWebpackConfig({dir, dev = false, shareConfig, corenConfig}) {
  const distDir = join(dir, '.coren', 'public', 'dist');
  let plugins = [
    new AssetsPath({rootDir: dir, distDir, assetsLink: corenConfig.assetsLink || null}),
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
  let config = {
    ...shareConfig
  };
  config = {
    ...config,
    entry: corenConfig.tmpEntry,
    output: {
      path: distDir,
      filename: '[name].web.js'
    },
    plugins: [
      ...config.plugins,
      ...plugins
    ]
  };
  return webpack(config);
}
