var path  = require('path'),
    config = require('../../config'),
    email = require('../../lib/email'),
    guests       = require('../../lib/guests');

function afterWedding () {
    return Date.now() > config.date;
}

function resend(req, res, next) {
    console.log(req.body);

    var emailAddress = req.body.email.trim();

    if (afterWedding()) {
        return res.redirect('/rsvp/');
    }

    if (!emailAddress) {
        return res.redirect('/rsvp/?email=0');
    }

    guests.loadGuestByEmail(emailAddress, function (err, guest) {
        if (err) { 
            return next(err); 
        }

        if (!guest) {
            return res.redirect('/rsvp/?missing=1');
        }

        email.sendRsvpLink(invitation, {
            guest : guest,
            resend: true
        }, function (err) {
                if (err) { return next(err); }

            res.redirect('/rsvp/');
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
    console.log(invitation);
    return res.render('rsvp/index', { title: 'Akshali\'s Wedding RSVP', active: 'rsvp', invitation: invitation });

    console.log(invitation);
    if (invitation.attending) {
        //return res.render('rsvp/attending');
    } else {
        //return res.render('rsvp/not-attending');
    }
}

exports.resend = resend;
exports.login  = login;
exports.index  = rsvp;
