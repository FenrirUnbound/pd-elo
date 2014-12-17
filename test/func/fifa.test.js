var expect = require('chai').expect;

describe('fifa strategy', function () {
  beforeEach(function () {
    this.fifa = require('../../').FifaStrategy;
  });

  it('has the correct API', function () {
    var me = this;
    var expectedEndpoints = [
      'calculate'
    ];

    expectedEndpoints.forEach(function (endpoint) {
      expect(me.fifa).to.have.property(endpoint)
        .that.is.a('function');
    });
  });

  it('evenly matched teams', function (done) {
    var me = this;
    var testData = {
      'homeRating': 1200,
      'awayRating': 1200,
      'homeScore': 5,
      'awayScore': 5
    };
    var expectedData = {
      'homeChange': 0,
      'awayChange': 0
    };

    me.fifa.calculate(testData, function (error, result) {
      expect(error).to.be.null;
      expect(result).to.be.an('object');

      Object.keys(expectedData).forEach(function (data) {
        expect(result).to.have.property(data);
        expect(result[data]).to.equal(expectedData[data]);
      });

      done();
    });
  });

  it('close game with even-strength teams', function (done) {
    var me = this;
    var testData = {
      'homeRating': 1200,
      'awayRating': 1200,
      'homeScore': 5,
      'awayScore': 4
    };
    var expectedData = {
      'awayChange': -10,
      'homeChange': 10,
    };

    me.fifa.calculate(testData, function (error, result) {
      expect(error).to.be.null;

      Object.keys(expectedData).forEach(function (data) {
        expect(result).to.have.property(data);
        expect(result[data]).to.equal(expectedData[data]);
      });

      done();
    });
  });
});
