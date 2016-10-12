(function () {
  'use strict';

  angular
    .module('fitbits')
    .controller('FitBitsController', FitBitsController);

  FitBitsController.$inject = ['$scope', 'fitbitResolve', 'Authentication'];

  function FitBitsController($scope, fitbit, Authentication) {
    var vm = this;

    vm.fitbit = fitbit;
    vm.authentication = Authentication;

  }
}());
