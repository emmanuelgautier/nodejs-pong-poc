'use strict';

/**
 *
 *
 * @constructor
 * @param {Array} players
 * @api public
 */
function Score(players) {
  var score = {};

  score[players[0]] = 0;
  score[players[1]] = 0;

  this._score = score;
}

/**
 * Increment player score.
 *
 * @param {Number} player
 * @return {Number}
 * @api public
 */
Score.prototype.increment = function(player) {
  this._score[player] += 1;

  return this._score[player];
};

/**
 * Reset players score. All players point set to zero.
 *
 * @api public
 */
Score.prototype.reset = function() {
  var players = this._score.keys();

  this._score[players[0]] = 0;
  this._score[players[1]] = 0;
};

/**
 * Get player score.
 * If player function parameter doesn't exist or is not a valid player id, global score array will be returned.
 *
 * @param {Number} player
 * @return {Number}
 * @api public
 */
Score.prototype.get = function(player) {
  if(player === null || !this._score[player]) {
    return this._score;
  }

  return this._score[player];
};

module.exports = Score;
