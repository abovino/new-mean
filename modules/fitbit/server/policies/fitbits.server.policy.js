'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke FitBits Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/fitbits',
      permissions: '*'
    }, {
      resources: '/api/fitbits/:fitbitId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/fitbits',
      permissions: ['get']
    }, {
      resources: '/api/fitbits/:fitbitId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/fitbits',
      permissions: ['get']
    }, {
      resources: '/api/fitbits/:fitbitId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If FitBits Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an fitbit is being processed and the current user created it then allow any manipulation
  if (req.fitbit && req.user && req.fitbit.user && req.fitbit.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
