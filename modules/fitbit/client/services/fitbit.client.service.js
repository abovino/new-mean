(function () {
  'use strict';

  angular
    .module('fitbits.services')
    .factory('FitBitsService', FitBitsService);

  FitBitsService.$inject = ['$resource', '$log'];

  function FitBitsService($resource, $log) {
    var FitBit = $resource('/api/fitbits/:fitbitId', {
      fitbitId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(FitBit.prototype, {
      createOrUpdate: function () {
        var fitbit = this;
        return createOrUpdate(fitbit);
      }
    });

    return FitBit;

    function createOrUpdate(fitbit) {
      if (fitbit._id) {
        return fitbit.$update(onSuccess, onError);
      } else {
        return fitbit.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(fitbit) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
