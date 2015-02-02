'use strict';

var http        = require('http'),
    path        = require('path'),
    connect     = require('connect'),

    rootPath    = path.normalize(__dirname),

    compression = require('compression'),
    bodyParser  = require('body-parser'),
    serveStatic = require('serve-static'),

    app = connect();

app.use(compression());
app.use(bodyParser.urlencoded());
app.use(serveStatic(rootPath + '/public', {'index': ['index.html', 'index.htm']}));

http.createServer(app).listen(80);
