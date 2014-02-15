'use strict';

var express = require('express'),
    exphbs  = require('express3-handlebars'),
    app     = express(),
    http    = require('http'),
    routes  = require('./routes'),
    combo   = require('combohandler'),
    hbs;

app.use(express.compress());
app.use(express.static('public'));
app.use(app.router);

hbs = exphbs.create({
    defaultLayout: 'main',
    helpers: {}
});

app.set('port', process.env.PORT || 3000);
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.configure('production', function () {
    app.use(express.errorHandler());
    app.enable('view cache');
});

app.get('/', routes.index);
app.get('/combo', combo.combine({ rootPath: 'public' }), combo.respond);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
