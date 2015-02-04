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
    io  = socket(app);

var users = [];
io.on('connection', function(socket) {
  users.push(socket);

  socket.join('room');

  if(users.length == 2) {
    io.sockets.in('room').emit('start');
  }

  socket.on('paddle moved', function(positions) {
    socket.in('room').emit('paddle moved', positions);
  });

  socket.on('win', function() {
    socket.in('room').emit('win');
  });
});

app.listen(80, function() {
  console.log('Application is listening on port 80');
});
