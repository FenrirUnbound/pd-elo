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

  describe('even-strength teams', function () {
    beforeEach(function () {
      this.testData = {
        'homeRating': 1200,
        'awayRating': 1200
      };
    });

    it('should not update ratings for tied games', function (done) {
      var me = this;
      var expectedData = {
        'homeChange': 0,
        'awayChange': 0
      };
      me.testData.awayScore = 5;
      me.testData.homeScore = 5;

      me.fifa.calculate(me.testData, function (error, result) {
        expect(error).to.be.null;
        expect(result).to.be.an('object');

        Object.keys(expectedData).forEach(function (data) {
          expect(result).to.have.property(data);
          expect(result[data]).to.equal(expectedData[data]);
        });

        done();
      });
    });

    it('should slightly update ratings for close games', function (done) {
      var me = this;
      var expectedData = {
        'awayChange': -10,
        'homeChange': 10,
      };
      me.testData.awayScore = 4;
      me.testData.homeScore = 5;

      me.fifa.calculate(me.testData, function (error, result) {
        expect(error).to.be.null;
        expect(result).to.deep.equal(expectedData);

        done();
      });
    });

    it('should moderately update ratings for modest games', function (done) {
      var me = this;
      var expectedData = {
        'awayChange': -15,
        'homeChange': 15
      };
      me.testData.awayScore = 1;
      me.testData.homeScore = 3;

      me.fifa.calculate(me.testData, function (error, result) {
        expect(error).to.be.null;
        expect(result).to.deep.equal(expectedData);

        done();
      });
    });

    it('should significantly boost ratings for blowout games', function (done) {
      var me = this;
      var expectedData = {
        'awayChange': -20,
        'homeChange': 20
      };
      me.testData.awayScore = 5;
      me.testData.homeScore = 10;

      me.fifa.calculate(me.testData, function (error, result) {
        expect(error).to.be.null;
        expect(result).to.deep.equal(expectedData);

        done();
      });
    });
  });
});
