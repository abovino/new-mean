(function () {
  'use strict';

  angular
    .module('fitbits.admin')
    .controller('FitBitsAdminController', FitBitsAdminController);

  FitBitsAdminController.$inject = ['$scope', '$state', '$window', 'fitbitResolve', 'Authentication', 'Notification'];

  function FitBitsAdminController($scope, $state, $window, fitbit, Authentication, Notification) {
    var vm = this;

    vm.fitbit = fitbit;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing FitBit
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.fitbit.$remove(function() {
          $state.go('admin.fitbits.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> FitBit deleted successfully!' });
        });
      }
    }

    // Save FitBit
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.fitbitForm');
        return false;
      }

      // Create a new fitbit, or update the current instance
      vm.fitbit.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.fitbits.list'); // should we send the User to the list or the updated FitBit's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> FitBit saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> FitBit save error!' });
      }
    }
  }
}());
