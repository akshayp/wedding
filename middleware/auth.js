function checkGuest(req, res, next) {
    var invitation = req.invitation,
        guestId    = req.params.guest,
        guest;

    if (!invitation) {
        req.isAuthorized = false;
        return next();
    }

    invitation.guests.some(function (g) {
        if (g.id.toString() === guestId) {
            guest = g;
            return true;
        }
    });

    req.guest        = guest;
    req.isAuthorized = guest && guest.invitation.id === invitation.id;

    next();
}

function checkInvitation(req, res, next) {
    var invitation   = req.invitation,
        invitationId = req.params.invitation;

    req.isAuthorized = invitation && invitation.id.toString() === invitationId;

    next();
}

function isAuthorized(req, res, next) {
    if (req.isAuthorized) {
        next();
    } else {
        var err = new Error('Unauthorized request.');
        err.status = 401;
        next(err);
    }
}

exports.ensureInvitation = [checkInvitation, isAuthorized];
exports.ensureGuest      = [checkGuest, isAuthorized];