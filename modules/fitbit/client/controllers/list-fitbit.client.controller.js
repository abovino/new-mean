(function () {
  'use strict';

  angular
    .module('fitbits')
    .controller('FitBitsListController', FitBitsListController);

  FitBitsListController.$inject = ['FitBitsService'];

  function FitBitsListController(FitBitsService) {
    var vm = this;

    vm.fitbits = FitBitsService.query();
  }
}());
