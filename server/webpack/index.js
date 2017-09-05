import createClientConfig from './client-config';
import createServerConfig from './server-config';
import createShareConfig from './share-config';

export default function createWebpackConfig({dir, dev = false, corenConfig, clientWebpackPath} = {}) {
  const shareConfig = createShareConfig({dir, dev, corenConfig});
  let clientCompiler;
  if (clientWebpackPath) {
    clientCompiler = createClientConfig({config: require(clientWebpackPath)});
  }
  const serverCompiler = createServerConfig({dir, dev, shareConfig, corenConfig});
  return {
    clientCompiler, serverCompiler
  };
}
