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

var game = new Game(config, io, 'room');

io.on('connection', function(socket) {

  game.socketsHandler(socket);
});

app.listen(80, function() {
  console.log('Application is listening on port 80');
});
