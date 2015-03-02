'use strict';

module.exports = function (req, res, next) {
    var invitation = req.invitation;

    req.isAuthorized = invitation && invitation.invitation === req.params.invitation;

    if (req.isAuthorized) {
        next();
    } else {
        var err = new Error('Unauthorized request.');
        err.status = 401;
        next(err);
    }
};
