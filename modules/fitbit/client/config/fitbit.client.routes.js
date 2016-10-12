(function () {
  'use strict';

  angular
    .module('fitbits.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('fitbits', {
        abstract: true,
        url: '/fitbits',
        template: '<ui-view/>'
      })
      .state('fitbits.list', {
        url: '',
        templateUrl: '/modules/fitbits/client/views/list-fitbits.client.view.html',
        controller: 'FitBitsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'FitBits List'
        }
      })
      .state('fitbits.view', {
        url: '/:fitbitId',
        templateUrl: '/modules/fitbits/client/views/view-fitbit.client.view.html',
        controller: 'FitBitsController',
        controllerAs: 'vm',
        resolve: {
          fitbitResolve: getFitBit
        },
        data: {
          pageTitle: 'FitBit {{ fitbitResolve.title }}'
        }
      });
  }

  getFitBit.$inject = ['$stateParams', 'FitBitsService'];

  function getFitBit($stateParams, FitBitsService) {
    return FitBitsService.get({
      fitbitId: $stateParams.fitbitId
    }).$promise;
  }
}());
