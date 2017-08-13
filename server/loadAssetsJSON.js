import {existsSync, readFileSync} from 'fs';
import {assetsJSON} from './CONFIG';
export const defaultConfig = {
  webpack: null
};

export default function loadAssetsJSON(dir) {
  const path = assetsJSON(dir);
  const hasAssets = existsSync(path);
  if (hasAssets) {
    return JSON.parse(readFileSync(path, 'utf8'));
  }
  throw new Error('Coren cannot find `assets.json`, please build the static file first.');
}
