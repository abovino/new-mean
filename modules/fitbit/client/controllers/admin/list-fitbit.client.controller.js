(function () {
  'use strict';

  angular
    .module('fitbits.admin')
    .controller('FitBitsAdminListController', FitBitsAdminListController);

  FitBitsAdminListController.$inject = ['FitBitsService'];

  function FitBitsAdminListController(FitBitsService) {
    var vm = this;

    vm.fitbits = FitBitsService.query();
  }
}());
