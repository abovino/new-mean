(function () {
  'use strict';

  describe('FitBits Route Tests', function () {
    // Initialize global variables
    var $scope,
      FitBitsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _FitBitsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      FitBitsService = _FitBitsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('fitbits');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/fitbits');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('fitbits.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/fitbits/client/views/list-fitbits.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          FitBitsController,
          mockFitBit;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('fitbits.view');
          $templateCache.put('/modules/fitbits/client/views/view-fitbit.client.view.html', '');

          // create mock fitbit
          mockFitBit = new FitBitsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An FitBit about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          FitBitsController = $controller('FitBitsController as vm', {
            $scope: $scope,
            fitbitResolve: mockFitBit
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:fitbitId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.fitbitResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            fitbitId: 1
          })).toEqual('/fitbits/1');
        }));

        it('should attach an fitbit to the controller scope', function () {
          expect($scope.vm.fitbit._id).toBe(mockFitBit._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/fitbits/client/views/view-fitbit.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/fitbits/client/views/list-fitbits.client.view.html', '');

          $state.go('fitbits.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('fitbits/');
          $rootScope.$digest();

          expect($location.path()).toBe('/fitbits');
          expect($state.current.templateUrl).toBe('/modules/fitbits/client/views/list-fitbits.client.view.html');
        }));
      });
    });
  });
}());
