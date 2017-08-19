import webpack from 'webpack';

export default function createClientWebpackConfig({config}) {
  return webpack(config);
}
