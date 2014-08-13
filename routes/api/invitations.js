var email  = require('../../lib/email'),
    guests   = require('../../lib/guests');

function read(req, res) {
    res.json(req.invitation);
}

function update(req, res, next) {
    guests.updateInvitation(req.invitation.id, { rsvpd: true }, function (err) {
        if (err) { return next(err); }
        res.send(204);
    });
}

function confirm(req, res, next) {
    email.sendConfirm(req.invitation, function (err) {
        if (err) { return next(err); }
        res.send(204);
    });
}

exports.read       = read;
exports.update     = update;
exports.confirm    = confirm;
