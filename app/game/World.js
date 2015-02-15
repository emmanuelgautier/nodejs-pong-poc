'use strict';

/**
 *
 *
 * @constructor
 * @param {Object} config
 * @param {Object} p2
 * @api public
 */
function World(config, p2) {
  this._config = config;
  this._p2 = p2;

  this._objects = {};
}

/**
 * Construct game world.
 *
 * @api protected
 */
World.prototype.create = function() {

  var createPaddle = function(position) {
    var shape = new this._p2.Rectangle(this._config.objects.paddle.width, this._config.objects.paddle.height),
        paddle = new this._p2.Body({
          position: [position.x, position.y]
        });

    paddle.addShape(shape);

    return paddle;
  };

  var createWall = function(position) {
    var shape = new this._p2.Plane(this._config.objects.walls.width, this._config.objects.wall.height),
        wall = new this._p2.Body({
          position: [position.x, position.y]
        });

    wall.addShape(shape);

    return wall;
  };

  var createGoal = function(position) {
    var shape = new this._p2.Line(this._config.objects.goal.width, this._config.objects.goal.height),
        goal = new this._p2.Body({
          position: [position.x, position.y]
        });

    goal.addShape(shape);

    return goal;
  };

  var createBall = function(position) {
    var shape = new this._p2.Circle(this._config.objects.ball.width, this._config.objects.ball.height),
        ball = new this._p2.Body({
          position: [position.x, position.y]
        });

    ball.addShape(shape);

    return ball;
  };

  var world = this._p2.world();

  var paddles = [];
    paddles[0] = createPaddle(this._config.objects.paddle.position[0]);
    paddles[1] = createPaddle(this._config.objects.paddle.position[1]);

  var walls = [];
    walls[0] = createWall(this._config.objects.walls.position[0]);
    walls[1] = createWall(this._config.objects.walls.position[1]);

  var goals = [];
    goals[0] = createGoal(this._config.objects.goal.position[0]);
    goals[1] = createGoal(this._config.objects.goal.position[1]);

  var ball = createBall(this._config.objects.ball.position);

  world.addBody(paddles[0]);
  world.addBody(paddles[1]);

  world.addBody(walls[0]);
  world.addBody(walls[1]);

  world.addBody(goals[0]);
  world.addBody(goals[1]);

  world.addBody(ball);

  this._world = world;

  this._objects.paddles = paddles;
  this._objects.walls = walls;
  this._objects.goals = goals;
  this._objects.ball = ball;
};

module.exports = World;
