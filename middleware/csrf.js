module.exports = function (req, res, next) {
    var csrfToken = res.locals._csrf = req.session._csrf;
    res.expose(csrfToken, 'window.CSRF_TOKEN');
    next();
};
