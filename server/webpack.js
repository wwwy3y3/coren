import createClientConfig from './webpack/client-config';
import createServerConfig from './webpack/server-config';
import createShareConfig from './webpack/share-config';

export default function createWebpackConfig({dir, dev = false, corenConfig} = {}) {
  const shareConfig = createShareConfig({dir, dev, corenConfig});
  const clientCompiler = createClientConfig({dir, dev, shareConfig, corenConfig});
  const serverCompiler = createServerConfig({dir, dev, shareConfig, corenConfig});
  return {
    clientCompiler, serverCompiler
  };
}
