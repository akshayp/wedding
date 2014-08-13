var path  = require('path'),
    config = require('../../config'),
    email = require('../../lib/email'),
    guests       = require('../../lib/guests');

function afterWedding () {
    return Date.now() > config.date;
}

function resend(req, res, next) {
    var emailAddress = req.body.email.trim();

    if (afterWedding()) {
        return res.redirect('/rsvp/');
    }

    if (!emailAddress) {
        req.session.resent = { needsEmail: true };
        return res.redirect('/rsvp/');
    }

    guests.loadGuestByEmail(emailAddress, function (err, guest) {
        if (err) { return next(err); }

        if (!guest) {
            req.session.resent = { notGuest: emailAddress };
            return res.redirect('/rsvp/');
        }

        guests.loadGuestByInvitation(guest.invitation.id, function (err, invitation) {
            if (err) { return next(err); }

            email.sendRsvpLink(invitation, {
                guest : guest,
                resend: true
            }, function (err) {
                if (err) { return next(err); }

                req.session.resent = { sent: emailAddress };
                res.redirect('/rsvp/');
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
        return res.render('rsvp/after');
    }

    res.locals.resent = req.session.resent;
    delete req.session.resent;

    if (!invitation || !invitation.rsvpd) {
        return res.render('rsvp/index', { title: 'Akshali\'s Wedding RSVP', active: 'rsvp' });
    }

    if (invitation.attending) {
        return res.render('rsvp/attending');
    } else {
        return res.render('rsvp/not-attending');
    }
}

exports.resend = resend;
exports.login  = login;
exports.index  = rsvp;
