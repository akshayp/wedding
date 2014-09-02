var path  = require('path'),
    config = require('../../config'),
    email = require('../../lib/email'),
    guests       = require('../../lib/guests');

function afterWedding () {
    return Date.now() > config.date;
}

function submit(req, res, next) {

    var emailAddress = req.body.email.trim();

    if (afterWedding()) {
        return res.redirect('/rsvp/');
    }

    if (!emailAddress) {
        return res.render('rsvp', {
            title: 'Akshali\'s Wedding RSVP',
            active: 'rsvp',
            message: 'Provide a valid email address',
            type: 'error'
        });
    }

    guests.loadGuestByEmail(emailAddress, function (err, guest) {
        if (err) { 
            return next(err); 
        }

        if (!guest) {
            return res.render('rsvp', {
                title: 'Akshali\'s Wedding RSVP',
                active: 'rsvp',
                message: 'We could not find you in our list. Please <a class="LightText Td-u Fw-b" href="mailto:rsvp@akshali.me">reach out</a> to us to RSVP.',
                type: 'error'
            });
        }
    });
}

function resend(req, res, next) {

    var emailAddress = req.body.email.trim();

    if (afterWedding()) {
        return res.redirect('/rsvp/');
    }

    if (!emailAddress) {
        return res.render('rsvp', {
            title: 'Akshali\'s Wedding RSVP',
            active: 'rsvp',
            message: 'Provide a valid email address',
            type: 'error'
        });
    }

    guests.loadGuestByEmail(emailAddress, function (err, guest) {
        if (err || !guest) {
            return res.render('rsvp', {
                title: 'Akshali\'s Wedding RSVP',
                active: 'rsvp',
                message: 'We could not find you in our list. Please <a class="LightText Td-u Fw-b" href="mailto:rsvp@akshali.me">reach out</a> to us to RSVP.',
                type: 'error'
            });
        }

        email.sendRsvpLink(guest, function (err) {
                if (err) { return next(err); }

            return res.render('rsvp', {
                title: 'Akshali\'s Wedding RSVP',
                active: 'rsvp',
                message: 'We have just emailed you your invitation link. Please click the link to login',
                type: 'success'
            });
        });
    });
}

function login(req, res, next) {
    var id;

    if (afterWedding()) {
        delete req.session.invitation;
        return res.redirect('/rsvp/');
    }

    try {
        id = email.decipherId(req.params.invitationkey);
    } catch (e) {
        delete req.session.invitation;
        var err = new Error('Unauthorized request.');
        err.status = 401;
        return next(err);
    }

    guests.loadGuest(id, function (err, guest) {
        if (err || !guest) {
            delete req.session.invitation;
            return next(err);
        }

        // Set the invitation on the session and redirect up one path level.
        req.session.invitation = guest.invitation;
        res.redirect(path.resolve(req.path, '..') + '/');
    });
}


function rsvp(req, res) {
    var invitation = req.invitation;

    if (afterWedding()) {
        return res.render('after');
    }
    //console.log(invitation);
    return res.render('rsvp', { title: 'Akshali\'s Wedding RSVP', active: 'rsvp', invitation: invitation });
}

exports.submit = submit;
exports.resend  = resend;
exports.login  = login;
exports.index  = rsvp;
