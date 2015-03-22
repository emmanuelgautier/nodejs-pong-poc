'use strict';

var fs      = require('fs'),
    path    = require('path'),
    events  = require('events'),

    p2      = require('p2'),
    uuid    = require('node-uuid'),

    Score     = require('./Score'),
    Controls  = require('./Controls'),
    Player    = require('./Player'),
    World     = require('./World');

/**
 *
 * @constructor
 * @param {Object} config
 * @param {String} room
 * @api public
 */
function Game(config, connection, room) {

    this.eventEmitter = new events.EventEmitter();

    this.interval = 20;
    this.startTime = new Date().getTime();
    this.time = this.startTime;
    this.lastTime = 0;

    this.physicsElapsed = this.calculatePhysicsElapsed(this.interval);

    this._connection = connection;

    this.uuids = [];
    this.users = {}

    this._config = config;
    this._room = room;

    this._host = null;

    this.running = false;

    this._eventsListenersHandler();
}

/**
 * Create a new player.
 *
 * @param {String} uuid
 * @return {Object}
 * @api protected
 */
Game.prototype._createPlayer = function(uuid) {

    var player = new Player(uuid, new Controls(null, this._config.velocity.paddle));

    return player;
  };

/**
 * Handle events listeners.
 *
 * @api protected
 */
Game.prototype._eventsListenersHandler = function() {

  var that = this;

  fs.readdirSync(__dirname + '/events').forEach(function(filename) {
    if (/\.js$/.test(filename)) {
      var name = path.basename(filename, '.js'),
          eventListener = function () { return require('./events/' + name); }();

      that.eventEmitter.on(name, function() { eventListener.apply(that, arguments); });
    }
  });


};

/**
 * Handle users websockets transactions.
 *
 * @param {Object} socket
 * @api public
 */
Game.prototype.socketsHandler = function(socket) {

  //only two players in the game
  if(Object.keys(this.users).length >= 2) {
    return;
  }

  var id = uuid.v1();

  this.uuids.push(id);

  var user = this.users[id] = {};
    user.socket = socket;
    user.player = this._createPlayer(id);
    user.ready  = false;

  this.inputs[id] = [];

  if(!this._host) {
    this._host = user;
  }

  var game = this;

  socket.join(this._room);

  socket.on('preload config', function() {
    socket.emit('config', game._config);
  });

  socket.on('ready', function() {
    game.eventEmitter.emit('playerReady', id);
  });

  socket.on('input', function(input) {
    this.inputHandler(id, input);
  });
};

/**
 * Handle user input
 *
 * @param {String} player
 * @param {Number}
 * @api protected
 */
Game.prototype.inputHandler = function(player, input) {

  this.inputs[player].unshift(input);
};

/**
 *
 * @param {String} name
 * @param {String} message
 * @api protected
 */
Game.prototype.broadcast = function(name, message) {

  this._connection.to(this._room).emit(name, message);
};

/**
 *
 * @api protected
 */
Game.prototype.updatePaddles = function() {

  var cursors = this.world.updatePaddles(this.inputs);

  this.users[this.uuids[0]].socket.emit('paddle moves', cursors[this.uuids[1]]);
  this.users[this.uuids[1]].socket.emit('paddle moves', cursors[this.uuids[0]]);
};

/**
 *
 * @api protected
 */
Game.prototype.update = function() {

  var objects = this.world.objects;

  var positions = {};

  for(object in objects) {
    positions[object] = objects.position;
  }

  this.broadcast('positions', positions);

  //position check
  //if one player win
};

/**
 *
 * @api public
 */
Game.prototype.start = function() {

  this.score = new Score(this.uuids),
  this.world = new World(this._config, this.physicsElapsed, p2);

  this.world.create();

  //set paddles created to players controls
  var paddles = this.world.Objects.paddles;

  this.users[this.uuids[0]].player.Controls.Paddle = paddles[0];
  this.users[this.uuids[1]].player.Controls.Paddle = paddles[1];

  this.users[this.uuids[0]].player.setScore(this.score);
  this.users[this.uuids[1]].player.setScore(this.score);

  this.running = true;
  this.run();

  this.broadcast('start');
};

/**
 *
 * @api protected
 */
Game.prototype.run = function() {
  if(this.running) {
    this.updatePaddles();

    this.time = new Date().getTime();
    while(this.lastTime <= this.time) {
      this.update();

      this.lastTime += this.physicsElapsed;
    }

    var that = this;
    setTimeout(function() { that.run(); }, 5);
  }
};

/**
 *
 * @api public
 */
Game.prototype.stop = function() {
  this.running = false;

  this.broadcast('stop');
};

/**
 * Calculate physics elapsed in milliseconds from interval refresh
 *
 * @param {Number}
 * @return {Number}
 * @api protected
 */
Game.prototype.calculatePhysicsElapsed = function(interval) {

  return Math.round(1000 / interval);
};

/**
 *
 * @return {Number}
 * @api public
 */
Game.prototype.getInterval = function() {

  return this.interval;
};

/**
 *
 * @param {Number} interval
 * @api public
 */
Game.prototype.setInterval = function(interval) {

  this.interval = interval;

  this.physicsElapsed = this.calculatePhysicsElapsed(interval);
};

module.exports = Game;
