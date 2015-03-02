'use strict';
var guests = require('../lib/guests');

module.exports = function (req, res, next) {
    var invitationId = req.session.invitation,
        hasRoute;

    // Skip when no invitation in session or it's a combo URL.
    if (!invitationId || /^\/combo\//.test(req.path)) {
        return next();
    }

    // Haxor for now :(
    var stack = req.app._router.stack;

    hasRoute = stack.some(function (item) {
        var route = item.route;
        if (route && route.path) {
            return route.path.match(req.path);
        }
    });

    if (req.path.indexOf('/api/') !== -1) {
        hasRoute = true;
    }

    if (!hasRoute) {
        return next();
    }

    guests.loadGuestByInvitation(invitationId, function (err, invitation) {
        if (err) { return next(err); }

        req.invitation = invitation;
        res.locals.invitation = invitation;
        next();
    });
};
