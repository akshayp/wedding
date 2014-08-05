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
        }
    }
});

app.set('port', process.env.PORT || 3000);
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

if (env !== 'development') {
    app.use(middleware.error);
    app.enable('view cache');
}

/* ----- Middleware ----- */

app.use(logger('combined'));
app.use(compress());
app.use(cookie());
app.use(session(config.session));
app.use(body.json());
app.use(body.urlencoded({ extended: true }));
app.use(override());
app.use(csrf());
app.use(middleware.csrfToken);
app.use(middleware.invitation);

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
app.get('/rsvp/', routes.rsvp.pub, routes.rsvp.edit);
app.post('/rsvp/', routes.rsvp.resend);
app.get('/rsvp/:invitationkey', routes.rsvp.login);

app.all('/invitations/:invitation/*', middleware.auth.ensureInvitation);
app.get('/invitations/:invitation/', routes.invitations.read);
app.put('/invitations/:invitation/', routes.invitations.update);
app.get('/invitations/:invitation/guests', routes.invitations.readGuests);
app.post('/invitations/:invitation/confirm', routes.invitations.confirm);
app.all('/guests/:guest/', middleware.auth.ensureGuest);
app.get('/guests/:guest/', routes.guests.read);
app.put('/guests/:guest/', routes.guests.update);
app.get('/combo/:version', combo.combine({ rootPath: 'public' }), combo.respond);


/* ----- Server ----- */

http.createServer(app).listen(app.get('port'), function () {
    console.log('Akshali'.green + ' listening on port ' + app.get('port').toString().magenta);
});
