var async = require('async');
var WEIGHT_INDEX = 20;

function calculate(options, callback) {
  async.waterfall([
    function validateInput(next) {
      next(null, options);
    },
    defineVariables,
    pointChange,
    function formatCalculationResult(ratingChange, next) {
      var result = {
        'awayChange': -1 * ratingChange,
        'homeChange': ratingChange
      };

      next(null, result);
    }
  ], callback);
}

function defineVariables(options, callback) {
  var awayRating = options.awayRating;
  var awayScore = options.awayScore;
  var homeRating = options.homeRating;
  var homeScore = options.homeScore;

  async.parallel({
    expectedMatchResult: function (next) {
      var expectedResult = expectedMatchResult_(homeRating, awayRating);
      next(null, expectedResult);
    },
    goalCoefficient: function (next) {
      var coefficient = goalCoefficient_(homeScore, awayScore);
      next(null, coefficient);
    },
    matchResult: function (next) {
      var result = actualMatchResult_(homeScore, awayScore);
      next(null, result);
    },
    weightIndex: function (next) {
      var weightIndex = weightIndex_();
      next(null, weightIndex);
    }
  }, callback);
}

function pointChange(options, callback) {
  var weightIndex = options.weightIndex;
  var coefficient = options.goalCoefficient;
  var matchResult = options.matchResult;
  var expectedMatchResult = options.expectedMatchResult;

  var result = weightIndex * coefficient * (matchResult - expectedMatchResult);
  callback(null, result);
}

function expectedMatchResult_(selfRating, opponentRating) {
  var ratingDifference = selfRating - opponentRating;
  var exponent = -1 * ratingDifference / 400;

  return 1/(Math.pow(10, exponent) + 1);
}

function actualMatchResult_(selfScore, opponentScore) {
  var scoreDifference = selfScore - opponentScore;
  var result = 0;

  if(scoreDifference > 0) {
    result = 1;
  } else if (scoreDifference === 0) {
    result = 0.5;
  }

  return result;
}

function goalCoefficient_(selfScore, opponentScore) {
  return 1;
}

function weightIndex_() {
  return WEIGHT_INDEX;
}

module.exports = {
  calculate: calculate
};
