const CollectorManager = require('./collectorManager');

// create a singleton
exports.collectorManager = new CollectorManager();

// ssr renderer
exports.SingleRouteRenderer = require('./ssrRenderers/singleRoute');

// collectors
exports.HeadCollector = require('./collectors/headCollector');
