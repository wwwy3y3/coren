import createClientConfig from './client-config';
import createServerConfig from './server-config';

export default function createWebpackConfig({dir, dev = false, corenConfig, clientWebpackPath} = {}) {
  let clientCompiler;
  if (clientWebpackPath) {
    clientCompiler = createClientConfig({config: require(clientWebpackPath)});
  }
  const serverCompiler = createServerConfig({dir, dev, corenConfig});
  return {
    clientCompiler, serverCompiler
  };
}
