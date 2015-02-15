'use strict';

var http        = require('http'),
    path        = require('path'),
    rootPath    = path.normalize(__dirname),

    connect     = require('connect'),
    socket      = require('socket.io'),

    compression = require('compression'),
    bodyParser  = require('body-parser'),
    serveStatic = require('serve-static'),

    connect     = connect();

connect.use(compression());
connect.use(bodyParser.urlencoded());
connect.use(serveStatic(rootPath + '/public', {'index': ['index.html', 'index.htm']}));

var app = http.createServer(connect),
    io  = socket(app),

    config = require('./app/config'),

    Game = require('./app/game');

var users = [], game;
io.on('connection', function(socket) {
  users.push(socket);

  socket.join('room');

  if(users.length == 2) {
    game = new Game(config, io.sockets.in('room'));
  }

  socket.on('preload', function() {
    socket.emit('config', config);
  });


});

app.listen(80, function() {
  console.log('Application is listening on port 80');
});
