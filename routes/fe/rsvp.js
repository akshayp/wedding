var path  = require('path'),
    config = require('../../config'),
    error        = require('../../lib/utils').error,
    sendRsvpLink = require('../../lib/email').sendRsvpLink,
    invs         = require('../../lib/invitations'),
    guests       = require('../../lib/guests');

function afterWedding () {
    return Date.now() > config.date;
}

function pub(req, res, next) {
    if (afterWedding()) {
        return res.render('rsvp/after');
    }

    if (req.invitation) {
        return next();
    }

    res.locals.resent = req.session.resent;
    delete req.session.resent;

    res.render('rsvp/index', { title: 'Akshali\'s Wedding RSVP', active: 'rsvp' });
}

function resend(req, res, next) {
    var email = req.body.email.trim();

    if (afterWedding()) {
        return res.redirect('/rsvp/');
    }

    if (!email) {
        req.session.resent = {needsEmail: true};
        return res.redirect('/rsvp/');
    }

    guests.loadGuestByEmail(email, function (err, guest) {
        if (err) { return next(err); }

        if (!guest) {
            req.session.resent = {notGuest: email};
            return res.redirect('/rsvp/');
        }

        invs.loadInvitation(guest.invitation.id, function (err, invitation) {
            if (err) { return next(err); }

            sendRsvpLink(invitation, {
                guest : guest,
                resend: true
            }, function (err) {
                if (err) { return next(err); }

                req.session.resent = {sent: email};
                res.redirect('/rsvp/');
            });
        });
    });
}

function login(req, res, next) {
    var invitationId;

    if (afterWedding()) {
        delete req.session.invitation;
        return res.redirect('/rsvp/');
    }

    try {
        invitationId = invs.decipherId(req.params.invitationkey);
    } catch (e) {
        delete req.session.invitation;
        return next(error(401));
    }

    invs.loadInvitation(invitationId, function (err, invitation) {
        if (err || !invitation) {
            delete req.session.invitation;
            return next(err);
        }

        // Set the invitation on the session and redirect up one path level.
        req.session.invitation = invitationId;
        res.redirect(path.resolve(req.path, '..') + '/');
    });
}

function edit(req, res) {
    var invitation = req.invitation,
        attending;

    if (!invitation.rsvpd) {
        return res.render('rsvp/respond');
    }

    attending = invitation.guests.some(function (guest) {
        return guest.attending;
    });

    if (attending) {
        res.render('rsvp/attending');
    } else {
        res.render('rsvp/not-attending');
    }
}

exports.pub    = pub;
exports.resend = resend;
exports.login  = login;
exports.edit   = edit;
