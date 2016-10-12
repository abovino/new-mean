(function (app) {
  'use strict';

  app.registerModule('fitbits', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('fitbits.admin', ['core.admin']);
  app.registerModule('fitbits.admin.routes', ['core.admin.routes']);
  app.registerModule('fitbits.services');
  app.registerModule('fitbits.routes', ['ui.router', 'core.routes', 'fitbits.services']);
}(ApplicationConfiguration));
