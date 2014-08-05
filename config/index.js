var env = process.env,
    path = require('path');

module.exports = {

    database: env.DATABASE_URL,

    session: {
        keys   : ['akshali.session'],
        secret: env.SESSION_SECRET,

        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
        }
    },

    invitationSecret: env.INVITATION_SECRET,

    mailgun: {
        endpoint: env.MAILGUN_API_SERVER && (env.MAILGUN_API_SERVER + '/'),
        domain : env.MAILGUN_DOMAIN,
        secret : env.MAILGUN_API_KEY
    },

    email: {
        from: 'Vaishali & Akshay <rsvp@akshali.me>'
    },

    dirs: {
        emails  : path.resolve('views/emails/')
    },

    date: new Date('Sat Nov 1 2014 6:30:00 GMT-0400 (EDT)'),

    version: require('../package').version
};
