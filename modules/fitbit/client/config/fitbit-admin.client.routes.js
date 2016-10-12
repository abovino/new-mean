(function () {
  'use strict';

  angular
    .module('fitbits.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.fitbits', {
        abstract: true,
        url: '/fitbits',
        template: '<ui-view/>'
      })
      .state('admin.fitbits.list', {
        url: '',
        templateUrl: '/modules/fitbits/client/views/admin/list-fitbits.client.view.html',
        controller: 'FitBitsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.fitbits.create', {
        url: '/create',
        templateUrl: '/modules/fitbits/client/views/admin/form-fitbit.client.view.html',
        controller: 'FitBitsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          fitbitResolve: newFitBit
        }
      })
      .state('admin.fitbits.edit', {
        url: '/:fitbitId/edit',
        templateUrl: '/modules/fitbits/client/views/admin/form-fitbit.client.view.html',
        controller: 'FitBitsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          fitbitResolve: getFitBit
        }
      });
  }

  getFitBit.$inject = ['$stateParams', 'FitBitsService'];

  function getFitBit($stateParams, FitBitsService) {
    return FitBitsService.get({
      fitbitId: $stateParams.fitbitId
    }).$promise;
  }

  newFitBit.$inject = ['FitBitsService'];

  function newFitBit(FitBitsService) {
    return new FitBitsService();
  }
}());
