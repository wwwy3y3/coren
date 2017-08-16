import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';
import {outputCommonJSDir} from '../CONFIG';

export default function serverClientWebpackConfig({dir, shareConfig, corenConfig}) {
  const config = {
    ...shareConfig,
    entry: corenConfig.entry,
    target: 'node',
    output: {
      path: outputCommonJSDir(dir),
      filename: '[name].commonjs2.js',
      libraryTarget: 'commonjs2'
    },
    externals: [
      nodeExternals(),
      /^(coren|\$)$/i,
      ...shareConfig.externals
    ]
  };
  return webpack(config);
}
