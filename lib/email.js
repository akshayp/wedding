'use strict';

var async = require('async');
var exphbs = require('express-handlebars');
var path = require('path');
var Mailgun = require('mailgun-js');
var crypto = require('crypto');
var base64url = require('base64url');
var config = require('../config');
var templates = path.resolve('views/emails/');
var mailgunConf = config.mailgun;

var mailgun = new Mailgun({ apiKey: mailgunConf.secret, domain: mailgunConf.domain });

var hbs = exphbs.create({
    layoutsDir: 'views/emails/layouts/',
    defaultLayout: 'index',
    helpers: {}
});

function encipherId (id) {
    var cipher = crypto.createCipher('bf', config.invitationSecret);
    var ciphered = cipher.update(id, 'utf8', 'base64');
    ciphered += cipher.final('base64');

    return base64url.fromBase64(ciphered);
}

function decipherId (encipheredId) {
    encipheredId = base64url.toBase64(encipheredId);
    var decipher = crypto.createDecipher('bf', config.invitationSecret);
    var deciphered = decipher.update(encipheredId, 'base64', 'utf8');
    deciphered += decipher.final('utf-8');

    return deciphered;
}

function send (to, subject, body, callback) {
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

function setupEmail (guest, subject, template, callback) {
    async.waterfall([
        function renderEmail (cb) {
            hbs.renderView(path.join(templates, template), guest, cb);
        },
        function sendEmail (body, cb) {
            var to = guest.name + ' <' + guest.email + '>';

            if (to) {
                send(to, subject, body, cb);
            } else {
                callback('Guest: ' + guest.id + ' has no email.');
            }
        }
    ], callback);
}

function sendConfirm (guest, callback) {
    var subject = 'Confirmed invitation response for Akshali\'s wedding',
        template = guest.attending ? 'attending.handlebars' : 'notattending.handlebars';

    setupEmail(guest, subject, template, callback);
}

function sendRsvpLink (guest, callback) {
    var subject = 'Akshali\'s Wedding Invitation',
        template = 'rsvp.handlebars';

    setupEmail(guest, subject, template, callback);
}

function sendRsvpReminder (guest, callback) {
    var subject = 'Akshali\'s Wedding RSVP Reminder',
        template = 'rsvp-reminder.handlebars';

    setupEmail(guest, subject, template, callback);
}

function sendReminder (guest, callback) {
    var subject = 'Akshali\'s Wedding Reminder',
        template = 'reminder.handlebars';

    setupEmail(guest, subject, template, callback);
}

exports.sendRsvpLink = sendRsvpLink;
exports.sendRsvpReminder = sendRsvpReminder;
exports.sendReminder = sendReminder;
exports.sendConfirm = sendConfirm;
exports.encipherId = encipherId;
exports.decipherId = decipherId;
