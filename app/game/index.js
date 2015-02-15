'use strict';

var p2 = require('p2'),
    uuid = require('node-uuid'),

    Score     = require('./Score'),
    Controls  = require('./Controls'),
    Player    = require('./Player'),
    World     = require('./World');

/**
 *
 * @constructor
 * @param {Object} config
 * @param {Object} connection
 * @api public
 */
function Game(config, connection) {

  var createPlayer = function(uuid) {
    var controls = new Controls(),

        player = new Player(uuid, controls);

    return player;
  };

  var uuids = [uuid.v1(), uuid.v1()],

      score = new Score(players),
      world = new World(config, p2);

  var players = [];
      players[uuids[0]] = createPlayer(uuids[0]);
      players[uuids[1]] = createPlayer(uuids[1]);

    this._config = config;
    this._connection = connection;
}

/**
 *
 * @api protected
 */
Game.prototype.start = function() {
  connection.emit('start');
};

/**
 *
 * @api protected
 */
Game.prototype.stop = function() {
  connection.emit('stop');
};

module.exports = Game;
