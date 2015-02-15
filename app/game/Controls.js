'use strict';

/**
 *
 * @constructor
 * @param {Object} Paddle
 * @api public
 */
function Controls(Paddle, velocity) {
  this._paddle = Paddle;
  this._velocity = velocity;
};

/**
 * Move paddle to specify position
 *
 * @param {Number} x
 * @api protected
 */
Controls.prototype.move = function(x) {
  this._paddle.position[0] = x;
};

/**
 * Move paddle up
 *
 * @api protected
 */
Controls.prototype.up = function() {

};

/**
 * Move paddle down
 *
 * @api protected
 */
Controls.prototype.down = function() {

};

module.exports = Controls;
