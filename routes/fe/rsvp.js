'use strict';

var path = require('path');
var config = require('../../config');
var email = require('../../lib/email');
var guests = require('../../lib/guests');

var TITLE = 'Akshali\'s Wedding RSVP',
    ACTIVE = 'rsvp',
    NOT_IN_LIST = 'We could not find you in our list. Please <a class="LightText Td-u Fw-b" href="mailto:rsvp@akshali.me">reach out</a> to us to RSVP.',
    NO_EMAIL = 'Provide a valid email address.',
    BOO_BOO = 'Something bad happened here :( Please hit submit again to retry',
    EMAIL_CONFIRMATION = 'We have sent you an email confirmation that we recieved your RSVP. Thanks for stopping by!',
    NO_RSVP = 'You forgot to pick an RSVP status to save.',
    TOO_MANY_EMAILS = 'We have sent you a confirmation more than 3 times. Please <a class="LightText Td-u Fw-b" href="mailto:rsvp@akshali.me">reach out</a> to us to RSVP.',
    TOO_MANY_CHANGES = 'You have changed your RSVP more than 3 times. Please <a class="LightText Td-u Fw-b" href="mailto:rsvp@akshali.me">reach out</a> to us if you need to make more changes.',
    SUCCESS = 'We have emailed you the invitation link. Please click the link in your email to start the RSVP process.',
    WARNING = 'Looks like you got to this link without going to the link we emailed you first. To proceed enter your email address below so you can get the invitation key to RSVP.',
    UNAUTHORIZED = 'Unauthorized request. Looks like you\'re trying to access a link that\'s invalid. Please use the link in your email or enter your email below.';


function stringToBool (val) {
    val = val || '';
    return (val + '').toLowerCase() === 'true';
}

function afterWedding () {
    return Date.now() > config.date;
}

function submit (req, res, next) {
    var invitation = req.invitation,
        attending = stringToBool(req.body.attending),
        plusone = req.body.plusone || '',
        notes = req.body.notes || '',
        mehndi = stringToBool(req.body.mehndi) || false,
        ceremony = stringToBool(req.body.ceremony) || false,
        reception = stringToBool(req.body.reception) || false;

    if (afterWedding()) {
        return res.redirect('/rsvp/');
    }

    if (!invitation) {
        return res.render('rsvp', {
            title: TITLE,
            active: ACTIVE,
            message: NO_RSVP,
            type: 'error'
        });
    }

    var numEmails = invitation.numEmails;

    if (numEmails && (numEmails > 3)) {
        return res.render('rsvp', {
            title: TITLE,
            active: ACTIVE,
            message: TOO_MANY_CHANGES,
            type: 'error'
        });
    }

    guests.updateGuest(invitation.id, {
        attending: attending,
        plusone: plusone,
        notes: notes,
        numEmails: numEmails + 1,
        events: {
            mehndi: {
                invited: invitation.events.mehndi.invited,
                attending: mehndi
            },
            ceremony: {
                invited: invitation.events.ceremony.invited,
                attending: ceremony
            },
            reception: {
                invited: invitation.events.reception.invited,
                attending: reception
            }
        }
    }, function (err, changedinvitation) {
        if (err || !changedinvitation) {
            return res.render('rsvp', {
                title: TITLE,
                active: ACTIVE,
                message: BOO_BOO,
                type: 'error'
            });
        }

        res.locals.invitation = changedinvitation;

        email.sendConfirm(changedinvitation, function (sendErr) {
            if (sendErr) {
                return next(sendErr);
            }

            return res.render('rsvp', {
                title: TITLE,
                active: ACTIVE,
                message: EMAIL_CONFIRMATION,
                type: 'success'
            });
        });
    });
}

function resend (req, res, next) {
    var emailAddress = req.body.email.trim();

    if (afterWedding()) {
        return res.redirect('/rsvp/');
    }

    if (!emailAddress) {
        return res.render('rsvp', {
            title: TITLE,
            active: ACTIVE,
            message: NO_EMAIL,
            type: 'error'
        });
    }

    guests.loadGuestByEmail(emailAddress, function (err, guest) {
        if (err || !guest) {
            return res.render('rsvp', {
                title: TITLE,
                active: ACTIVE,
                message: NOT_IN_LIST,
                type: 'error'
            });
        }

        if (guest.numEmails && (guest.numEmails > 3)) {
            return res.render('rsvp', {
                title: TITLE,
                active: ACTIVE,
                message: TOO_MANY_EMAILS,
                type: 'error'
            });
        }

        email.sendRsvpLink(guest, function (rsvpErr) {
            if (rsvpErr) {
                return next(rsvpErr);
            }

            var numEmails = guest.numEmails;

            guests.updateGuest(guest.id, { numEmails: numEmails + 1 }, function () {
                return res.render('rsvp', {
                    title: TITLE,
                    active: ACTIVE,
                    message: SUCCESS,
                    type: 'success'
                });
            });
        });
    });
}

function login (req, res, next) {
    var emailAdd;

    if (afterWedding()) {
        delete req.session.invitation;
        return res.redirect('/rsvp/');
    }

    try {
        emailAdd = email.decipherId(req.params.invitationkey);
    } catch (e) {
        delete req.session.invitation;

        return res.render('rsvp', {
            title: TITLE,
            active: ACTIVE,
            message: UNAUTHORIZED,
            type: 'error'
        });
    }

    guests.loadGuestByEmail(emailAdd, function (err, guest) {
        if (err || !guest) {
            delete req.session.invitation;
            return next(err);
        }

        // Set the invitation on the session and redirect up one path level.
        req.session.invitation = guest.invitation;
        res.redirect(path.resolve(req.path, '..') + '/');
    });
}


function rsvp (req, res) {
    var invitation = req.invitation,
        message = invitation ? '' : WARNING;

    if (afterWedding()) {
        return res.render('after');
    }

    if (req.query.edit === '1') {
        res.locals.editing = true;
    }

    return res.render('rsvp', {
        title: TITLE,
        active: ACTIVE,
        message: message,
        type: 'warning'
    });
}

exports.submit = submit;
exports.resend = resend;
exports.login = login;
exports.index = rsvp;
