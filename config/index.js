var env = process.env;

module.exports = {

    database: env.CONNECTION_STRING || 'mongodb://localhost/wedding',

    session: {
        keys   : ['akshali.session'],
        secret: env.SESSION_SECRET,
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
        }
    },

    invitationSecret: env.INVITATION_SECRET,

    mailgun: {
        domain : 'akshali.me',
        secret : env.MAILGUN_API_KEY
    },

    email: {
        from: 'Vaishali & Akshay <rsvp@akshali.me>'
    },

    date: new Date('Sat Nov 1 2014 6:30:00 GMT-0400 (EDT)'),

    version: require('../package').version
};
