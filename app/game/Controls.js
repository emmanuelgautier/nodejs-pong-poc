'use strict';

/**
 *
 * @constructor
 * @param {Object} Paddle
 * @param {Number} velocity
 * @api public
 */
function Controls(Paddle, velocity) {

  if(Paddle) {
    this.Paddle = Paddle;
  }

  this._velocity = velocity;
};

/**
 * Move paddle to specify position
 *
 * @param {Number} x
 * @api public
 */
Controls.prototype.move = function(x) {

  this.Paddle.position[0] = x;
};

/**
 * Move paddle up
 *
 * @api public
 */
Controls.prototype.up = function() {

  this.Paddle.velocity[1] = this._velocity;
};

/**
 * Move paddle down
 *
 * @api public
 */
Controls.prototype.down = function() {

  this.Paddle.velocity[1] = -this._velocity;
};

/**
 *
 * @api public
 */
Controls.prototype.Paddle = null;

module.exports = Controls;
