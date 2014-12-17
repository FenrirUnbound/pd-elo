var expect = require('chai').expect;

describe('strategies', function () {
  it('should be able to get all the strategies', function () {
    var expectedStrategies = [
      'FifaStrategy'
    ];
    var base = require('../');

    expectedStrategies.forEach(function (strategy) {
      expect(base).to.have.property(strategy)
        .that.is.ok;
    });
  });
});
