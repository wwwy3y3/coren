import {existsSync, readFileSync} from 'fs';
import {getAssetsJsonPath} from './coren-working-space';
import {color} from './utils';
const {error} = color;
export default function loadAssetsJSON(dir) {
  const path = getAssetsJsonPath(dir);
  const hasAssets = existsSync(path);
  if (hasAssets) {
    return JSON.parse(readFileSync(path, 'utf8'));
  }
  throw new Error(error('Cannot find `assets.json`, please build the webpack entry first.'));
}
