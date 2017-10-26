const path = require('path');
const ssr = require('../../lib/ssr').default;

const re = ssr(path.resolve('./dist/root'), './sss');
