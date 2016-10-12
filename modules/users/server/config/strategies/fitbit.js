'use strict';

/**
 * Module dependencies
 */
var passport = require('passport'),
  FitbitStrategy = require('passport-fitbit-oauth2').FitbitOAuth2Strategy,
  users = require('../../controllers/users.server.controller');

module.exports = function (config) {
  passport.use(new FitbitStrategy({
    clientID: config.fitbit.clientID,
    clientSecret: config.fitbit.clientSecret,
    callbackURL: config.fitbit.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    var providerData = profile._json;
    providerData.accessToken = accessToken;
    providerData.refreshToken = refreshToken;
  }
  ));
};
