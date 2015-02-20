'use strict';

/**
 * Constants
 *
 */
var COLLISION_BALL    = Math.pow(2, 0),
    COLLISION_PADDLE  = Math.pow(2, 1),
    COLLISION_WALL    = Math.pow(2, 2),
    COLLISION_GOAL    = Math.pow(2, 3);

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
 * @api public
 */
World.prototype.create = function() {

  var p2 = this._p2,
      config = this._config;

  var createPaddle = function(position) {

    var shape = new p2.Rectangle(config.objects.paddle.width, config.objects.paddle.height),
        paddle = new p2.Body({
          position: [position.x, position.y]
        });

    shape.collisionGroup = COLLISION_PADDLE;
    shape.collisionMask = COLLISION_BALL;

    paddle.addShape(shape);

    return paddle;
  };

  var createWall = function(position) {

    var shape = new p2.Plane(config.objects.wall.width, config.objects.wall.height),
        wall = new p2.Body({
          position: [position.x, position.y]
        });

    shape.collisionGroup = COLLISION_WALL;
    shape.collisionMask = COLLISION_BALL;

    wall.addShape(shape);

    return wall;
  };

  var createGoal = function(position) {

    var shape = new p2.Line(config.objects.goal.width, config.objects.goal.height),
        goal = new p2.Body({
          position: [position.x, position.y]
        });

    shape.collisionGroup = COLLISION_GOAL;
    shape.collisionMask = COLLISION_BALL;

    goal.addShape(shape);

    return goal;
  };

  var createBall = function(position) {

    var shape = new p2.Circle(config.objects.ball.width, config.objects.ball.height),
        ball = new p2.Body({
          position: [position.x, position.y]
        });

    shape.collisionGroup = COLLISION_BALL;
    shape.collisionMask = COLLISION_PADDLE | COLLISION_WALL | COLLISION_GOAL;

    ball.addShape(shape);

    return ball;
  };

  var world = new p2.World({
    gravity: [0, 0]
  });

  var paddles = [];
    paddles[0] = createPaddle(config.objects.paddle.position[0]);
    paddles[1] = createPaddle(config.objects.paddle.position[1]);

  var walls = [];
    walls[0] = createWall(config.objects.wall.position[0]);
    walls[1] = createWall(config.objects.wall.position[1]);

  var goals = [];
    goals[0] = createGoal(config.objects.goal.position[0]);
    goals[1] = createGoal(config.objects.goal.position[1]);

  var ball = createBall(config.objects.ball.position);

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
