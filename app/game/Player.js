'use strict';

var Controls = require('./Controls');

/**
 *
 *
 * @constructor
 * @param {Object} config
 * @param {Number} id
 * @param {Object} Score
 * @api public
 */
function Player(id, Controls) {
  this._id = id;
  this.Controls = Controls;
}

/**
 *
 * @api public
 */
Player.prototype.win = function() {
  this.Score.increment(this._id);
};

/**
 *
 * @api public
 */
Player.prototype.loose = function() {

};

/*
 *
 * @api public
 */
Player.prototype.Controls = null;

module.exports = Player;
