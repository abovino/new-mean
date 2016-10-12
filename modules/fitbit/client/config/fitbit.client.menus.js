(function () {
  'use strict';

  angular
    .module('fitbits')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'FitBits',
      state: 'fitbits',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'fitbits', {
      title: 'List FitBits',
      state: 'fitbits.list',
      roles: ['*']
    });
  }
}());
