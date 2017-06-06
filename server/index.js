
// collectorManager
exports.CollectorManager = require('./collectorManager');

// ssr renderer
exports.SingleRouteRenderer = require('./ssrRenderers/singleRoute');
exports.MultiRoutesRenderer = require('./ssrRenderers/multiRoutes');

// collectors
exports.HeadCollector = require('./collectors/headCollector');
exports.ReduxCollector = require('./collectors/reduxCollector');
exports.RoutesCollector = require('./collectors/routesCollector');
