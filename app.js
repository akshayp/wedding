/*jshint unused: false*/
'use strict';

var hbs, app, router,
    env         = process.env.NODE_ENV || 'development',
    colors      = require('colors'),
    http        = require('http'),
    body        = require('body-parser'),
    combo       = require('combohandler'),
    compress    = require('compression'),
    cookie      = require('cookie-parser'),
    csrf        = require('csurf'),
    exphbs      = require('express3-handlebars'),
    logger      = require('morgan'),
    override    = require('method-override'),
    session     = require('cookie-session'),
    slash       = require('express-slash'),
    state       = require('express-state'),
    express     = require('express'),
    config      = require('./config'),
    middleware  = require('./middleware'),
    routes      = require('./routes');

/* ----- Config ----- */

app = express();
state.extend(app);

app.enable('strict routing');

router = express.Router({
    caseSensitive: app.get('case sensitive routing'),
    strict       : app.get('strict routing')
});

hbs = exphbs.create({
    defaultLayout: 'main',
    helpers: {
        eq: function (context, options) {
            if (context === options.hash.compare) {
                return options.fn(this);
            }
            return options.inverse(this);
        },
        and: function (a, b, options) {
            if (a && b) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        },
        is: function (value, test, options) {
            if (value === test) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        },
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
        {id: 'wedding',   url: '/wedding/',   label: 'Wedding'},
        {id: 'logistics', url: '/logistics/', label: 'Logistics'},
        {id: 'registry',  url: '/registry/',  label: 'Registry'},
        {id: 'rsvp',      url: '/rsvp/',      label: 'RSVP'}
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

app.all('/api/invitations/:invitation/*', middleware.auth);
app.get('/api/invitations/:invitation/', routes.invitations.read);
app.put('/api/invitations/:invitation/', routes.invitations.update);
app.post('/api/invitations/:invitation/confirm', routes.invitations.confirm);
app.get('/combo/:version', combo.combine({ rootPath: 'public' }), combo.respond);


/* ----- Server ----- */

http.createServer(app).listen(app.get('port'), function () {
    console.log('Akshali'.green + ' listening on port ' + app.get('port').toString().magenta);
});
