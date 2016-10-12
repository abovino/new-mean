'use strict';

describe('FitBits E2E Tests:', function () {
  describe('Test fitbits page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/fitbits');
      expect(element.all(by.repeater('fitbit in fitbits')).count()).toEqual(0);
    });
  });
});
