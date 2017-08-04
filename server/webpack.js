import createClientConfig from './webpack/clientConfig';
import createServerConfig from './webpack/serverConfig';
import createShareConfig from './webpack/shareConfig';

export default function createWebpackConfig({dir, dev = false, corenConfig} = {}) {
  const shareConfig = createShareConfig({dir, dev, corenConfig});
  const clientCompiler = createClientConfig({dir, dev, shareConfig, corenConfig});
  const serverCompiler = createServerConfig({dir, dev, shareConfig, corenConfig});
  return {
    clientCompiler, serverCompiler
  };
}
