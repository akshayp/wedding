var async   = require('async'),
    exphbs  = require('express-handlebars'),
    path    = require('path'),
    Mailgun = require('mailgun-js'),
    crypto = require('crypto'),
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
    var ciphered = cipher.update(id, 'utf8', 'hex');
    ciphered += cipher.final('hex');

    return ciphered;
}

function decipherId(encipheredId) {
    var decipher = crypto.createDecipher('bf', config.invitationSecret);
    var deciphered = decipher.update(encipheredId, 'hex', 'utf8');
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

exports.sendRsvpLink    = sendRsvpLink;
exports.sendConfirm     = sendConfirm;
exports.encipherId      = encipherId;
exports.decipherId      = decipherId;
