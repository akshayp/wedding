var guests = require('../lib/guests');

module.exports = function (req, res, next) {
    var invitationId = req.session.invitation,
        hasRoute;

    // Skip when no invitation in session or it's a combo URL.
    if (!invitationId || /^\/combo\//.test(req.path)) {
        return next();
    }

    hasRoute = req.app.routes[req.method.toLowerCase()].some(function (route) {
        return route.match(req.path);
    });

    if (!hasRoute) {
        return next();
    }

    guests.loadInvitation(invitationId, function (err, invitation) {
        if (err) { return next(err); }

        req.invitation        = invitation;
        res.locals.invitation = invitation;
        res.expose(invitation, 'invitation');

        next();
    });
};
