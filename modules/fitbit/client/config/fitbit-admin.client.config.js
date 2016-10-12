(function () {
  'use strict';

  // Configuring the FitBits Admin module
  angular
    .module('fitbits.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage FitBits',
      state: 'admin.fitbits.list'
    });
  }
}());
