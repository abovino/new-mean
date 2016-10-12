'use strict';

/**
 * Module dependencies
 */
var fitbitsPolicy = require('../policies/fitbits.server.policy'),
  fitbits = require('../controllers/fitbits.server.controller');

module.exports = function (app) {
  // FitBits collection routes
  app.route('/api/fitbits').all(fitbitsPolicy.isAllowed)
    .get(fitbits.list)
    .post(fitbits.create);

  // Single fitbit routes
  app.route('/api/fitbits/:fitbitId').all(fitbitsPolicy.isAllowed)
    .get(fitbits.read)
    .put(fitbits.update)
    .delete(fitbits.delete);

  // Finish by binding the fitbit middleware
  app.param('fitbitId', fitbits.fitbitByID);
};
