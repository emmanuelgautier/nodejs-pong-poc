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
function Game(config, room) {

    this.eventEmitter = new events.EventEmitter();

    this.uuids = [];
    this.users = {}

    this._config = config;
    this._room = room;

    this._host = null;

    this._eventsListenersHandler();
}

/**
 * Create a new player.
 *
 * @param {String} uuid
 * @return {Object}
 * @api public
 */
Game.prototype._createPlayer = function(uuid) {

    var player = new Player(uuid, new Controls(null, this._config.velocity.paddle));

    return player;
  };

/**
 * Handle events listeners.
 *
 * @api public
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
};

/**
 *
 * @api public
 */
Game.prototype.start = function() {

  var score = new Score(this.uuids),
      world = new World(this._config, p2);

  world.create();

  //set paddles created to players controls
  var paddles = world.Objects.paddles;

  this.users[this.uuids[0]].player.Controls.Paddle = paddles[0];
  this.users[this.uuids[1]].player.Controls.Paddle = paddles[1];

  //this._host.socket.emit('start');
};

/**
 *
 * @api public
 */
Game.prototype.stop = function() {
  //connection.emit('stop');
};

module.exports = Game;
