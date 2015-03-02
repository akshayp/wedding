/* eslint no-unused-vars: 0, new-cap: 0*/
'use strict';

var env = process.env.NODE_ENV || 'development';
var colors = require('colors');
var http = require('http');
var body = require('body-parser');
var combo = require('combohandler');
var compress = require('compression');
var cookie = require('cookie-parser');
var csrf = require('csurf');
var exphbs = require('express-handlebars');
var logger = require('morgan');
var override = require('method-override');
var session = require('cookie-session');
var slash = require('express-slash');
var express = require('express');
var config = require('./config');
var middleware = require('./middleware');
var routes = require('./routes');

/* ----- Config ----- */

var app = express();

app.enable('strict routing');

var router = express.Router({
    caseSensitive: app.get('case sensitive routing'),
    strict: app.get('strict routing')
});

var hbs = exphbs.create({
    defaultLayout: 'main',
    helpers: {
        is: function (value, test, options) {
            if (value === test) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        }
    }
});

app.set('port', process.env.PORT || 3000);
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.disable('etag');

if (env !== 'development') {
    app.use(middleware.error);
    app.enable('view cache');
}

/* ----- Middleware ----- */

app.use(logger('combined', {
    skip: function (req, res) { return res.statusCode < 400; }
}));
app.use(compress());
app.use(cookie());
app.use(session(config.session));
app.use(body.json());
app.use(body.urlencoded({ extended: true }));
app.use(override());
app.use(csrf());
app.use(middleware.csrfToken);
app.use(middleware.invitation);
app.use(middleware.pjax);

app.use(express.static('public'));
app.use(router);
app.use(slash());

/* ----- Locals ----- */

app.locals = {
    version: config.version,
    nav: [
        {id: 'wedding', url: '/wedding/', label: 'Wedding'},
        {id: 'logistics', url: '/logistics/', label: 'Logistics'},
        {id: 'registry', url: '/registry/', label: 'Registry'},
        {id: 'rsvp', url: '/rsvp/', label: 'RSVP'}
    ]

};

/* ----- Routes ----- */

app.get('/', routes.index);
app.get('/wedding/', routes.wedding);
app.get('/logistics/', routes.logistics);
app.get('/registry/', routes.registry);
app.get('/rsvp/', routes.rsvp.index);
app.post('/rsvp/', routes.rsvp.submit);
app.post('/rsvp/resend', routes.rsvp.resend);
app.get('/rsvp/:invitationkey', routes.rsvp.login);

app.get('/combo/:version', combo.combine({ rootPath: 'public' }), combo.respond);


/* ----- Server ----- */

http.createServer(app).listen(app.get('port'), function () {
    console.log('Akshali'.green + ' listening on port ' + app.get('port').toString().magenta);
});
