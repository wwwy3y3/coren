
// create a singleton
exports.collectorManager = require('./singletonCollectorManager');

// ssr renderer
exports.SingleRouteRenderer = require('./ssrRenderers/singleRoute');

// collectors
exports.HeadCollector = require('./collectors/headCollector');
exports.ReduxCollector = require('./collectors/reduxCollector');
