var async   = require('async'),
    exphbs  = require('express-handlebars'),
    path    = require('path'),
    Mailgun = require('mailgun-js'),
    crypto = require('crypto'),
    base64url = require('base64url'),
    config = require('../config'),
    templates = path.resolve('views/emails/'),
    mailgunConf = config.mailgun,
    hbs;

var mailgun = new Mailgun({ apiKey: mailgunConf.secret, domain: mailgunConf.domain });

hbs = exphbs.create({
    layoutsDir: 'views/emails/layouts/',
    defaultLayout: 'index',
    helpers: {}
});

function encipherId(id) {
    var cipher = crypto.createCipher('bf', config.invitationSecret);
    var ciphered = cipher.update(id, 'utf8', 'base64');
    ciphered += cipher.final('base64');

    return base64url.fromBase64(ciphered);
}

function decipherId(encipheredId) {
    encipheredId = base64url.toBase64(encipheredId);
    var decipher = crypto.createDecipher('bf', config.invitationSecret);
    var deciphered = decipher.update(encipheredId, 'base64', 'utf8');
    deciphered += decipher.final('utf-8');

    return deciphered;
}

function send(to, subject, body, callback) {

    if (!(mailgunConf.domain && mailgunConf.secret)) {
        return callback(new Error('Email service not properly configured.'));
    }

    var data = {
        from: config.email.from,
        to: to,
        subject: subject,
        html: body
    };

    /*var fs = require('fs');
    fs.writeFile("email.html", body, function(err) {
        callback();
    });*/

    mailgun.messages().send(data, callback);
}

function setupEmail(guest, subject, template, callback) {
    async.waterfall([
        function renderEmail(callback) {
            hbs.renderView(path.join(templates, template), guest, callback);
        },
        function sendEmail (body, callback) {
            var to = guest.name + ' <' + guest.email + '>';

            if (to) {
                send(to, subject, body, callback);
            } else {
                callback('Guest: ' + guest.id + ' has no email.');
            }
        }
    ], callback);
}

function sendConfirm(guest, callback) {
    var subject = 'Confirmed invitation response for Akshali\'s wedding',
        template = guest.attending ? 'attending.handlebars' : 'notattending.handlebars';

    setupEmail(guest, subject, template, callback);
}

function sendRsvpLink(guest, callback) {
    var subject = 'Akshali\'s Wedding Invitation',
        template = 'rsvp.handlebars';

    setupEmail(guest, subject, template, callback);
}

function sendRsvpReminder(guest, callback) {
    var subject = 'Akshali\'s Wedding RSVP Reminder',
        template = 'rsvp-reminder.handlebars';

    setupEmail(guest, subject, template, callback);
}

function sendReminder(guest, callback) {
    var subject = 'Akshali\'s Wedding Reminder',
        template = 'reminder.handlebars';

    setupEmail(guest, subject, template, callback);
}

exports.sendRsvpLink        = sendRsvpLink;
exports.sendRsvpReminder    = sendRsvpReminder;
exports.sendReminder        = sendReminder;
exports.sendConfirm         = sendConfirm;
exports.encipherId          = encipherId;
exports.decipherId          = decipherId;
