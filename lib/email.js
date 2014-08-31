var async   = require('async'),
    exphbs  = require('express3-handlebars'),
    path    = require('path'),
    Mailgun = require('mailgun-js'),
    crypto = require('crypto'),
    config  = require('../config'),
    templates = path.resolve('views/emails/'),
    mailgun   = config.mailgun,
    hbs;


var mailgun = new Mailgun({ apiKey: mailgun.secret, domain: mailgun.domain });

hbs = exphbs.create({
    extname: '.hbs',
    helpers: {}
});

function encipherId(id) {
    var cipher = crypto.createCipher('bf', config.invitationSecret);
    cipher.update(String(id), 'utf8', 'hex');
    return cipher.final('hex');
}

function decipherId(encipheredId) {
    var decipher = crypto.createDecipher('bf', config.invitationSecret);
    decipher.update(new Buffer(encipheredId, 'hex'), 'utf8');
    return decipher.final('utf8');
}

function send(to, subject, body, callback) {
    if (!(mailgun.domain && mailgun.secret)) {
        return callback(new Error('Email service not properly configured.'));
    }

    var data = {
        from: config.email.from,
        to: to,
        subject: subject,
        html: body
    };

    mailgun.messages().send(data, callback);
}

function getEmailAddresses(guests) {
    return guests.filter(function (guest) {
        return !guest.is_plusone && !!guest.email;
    }).map(function (guest) {
        return guest.name + ' <' + guest.email + '>';
    }).join(', ');
}

function sendConfirm(invitation, callback) {
    var attending = invitation.guests.some(function (guest) {
        return guest.attending;
    });

    function renderEmail(callback) {
        var template = attending ? 'attending.hbs' : 'notattending.hbs';

        hbs.render(path.join(templates, template), {
            guests: invitation.guests
        }, callback);
    }

    function sendEmail(body, callback) {
        var to      = getEmailAddresses(invitation.guests),
            subject = 'Confirmed invitation response for our wedding';

        if (to) {
            send(to, subject, body, callback);
        } else {
            callback('Invitation: ' + invitation.id + ' has no recipients.');
        }
    }

    async.waterfall([
        renderEmail,
        sendEmail
    ], callback);
}

function sendRsvpLink(guest, options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options  = {};
    }

    options || (options = {});

    function renderEmail(callback) {
        var template = options.resend ? 'resend.hbs' : 'rsvp.hbs';

        hbs.render(path.join(templates, template), {
            id    : encipherId(invitation.id),
            guests: invitation.guests
        }, callback);
    }

    function sendEmail(body, callback) {
        // Send to both, or only one guest?
        var guests  = options.guest ? [options.guest] : invitation.guests,
            to      = getEmailAddresses(guests),
            subject = 'RSVP for our wedding';

        if (to) {
            send(to, subject, body, callback);
        } else {
            callback('Invitation: ' + invitation.id + ' has no recipients.');
        }
    }

    async.waterfall([
        renderEmail,
        sendEmail
    ], callback);
}

function sendReminder(invitation, callback) {
    var guestsAttending = invitation.guests.filter(function (guest) {
        return guest.attending;
    });

    function renderEmail(callback) {
        hbs.render(path.join(templates, 'reminder.hbs'), {
            id    : encipherId(invitation.id),
            rsvpd : invitation.rsvpd,
            guests: invitation.guests
        }, callback);
    }

    function sendEmail(body, callback) {
        var guests  = invitation.rsvpd ? guestsAttending : invitation.guests,
            to      = getEmailAddresses(guests),
            subject = 'Reserve a hotel room for our wedding';

        if (to) {
            send(to, subject, body, callback);
        } else {
            callback('Invitation: ' + invitation.id + ' has no recipients.');
        }
    }

    async.waterfall([
        renderEmail,
        sendEmail
    ], callback);
}

exports.sendRsvpLink    = sendRsvpLink;
exports.sendConfirm     = sendConfirm;
exports.sendReminder    = sendReminder;
exports.encipherId      = encipherId;
exports.decipherId      = decipherId;
