const NodeCache = require('node-cache');

// stdTTL: default time-to-live in seconds for every cached entry (10 minutes)
// checkperiod: how often expired keys are automatically cleaned up
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

module.exports = cache;