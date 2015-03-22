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
function World(config, physicsElapsed, p2) {

  this._config = config;
  this._physicsElapsed = physicsElapsed;
  this._p2 = p2;

  this.Objects = {};
}

/**
 * Create game world.
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

  world.step(this._physicsElapsed);

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

  this.Objects.paddles = paddles;
  this.Objects.walls = walls;
  this.Objects.goals = goals;
  this.Objects.ball = ball;
};

/**
 * Update paddles positions
 *
 * @param {Object} inputs
 * @return {Array} cursors
 * @api public
 */
World.prototype.updatePaddles = function(inputs) {

  var cursor = this._config.cursor,
      cursors = [];

  var input = null;

  for(var user in users) {
    cursors[user] = [0, 0];

    while(inputs[user].length != 0) {
      input = inputs[user].shift();

      if(input === cursor.up) {
        cursors[0] += 1;

        continue;
      }

      if(input === cursor.down) {
        cursors[1] += 1;

        continue;
      }
    }

    Player.Controls.up(cursors[0]);
    Player.Controls.down(cursors[1]);
  }

  return cursors;
};

/**
 *
 * @api public
 */
World.prototype.Objects = null;

module.exports = World;
