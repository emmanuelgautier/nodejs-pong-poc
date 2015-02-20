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
 * @api public
 */
Controls.prototype.move = function(x) {
  this._paddle.position[0] = x;
};

/**
 * Move paddle up
 *
 * @api public
 */
Controls.prototype.up = function() {
  this._paddle.velocity[1] = this._velocity;
};

/**
 * Move paddle down
 *
 * @api public
 */
Controls.prototype.down = function() {
  this._paddle.velocity[1] = -this._velocity;
};

module.exports = Controls;
