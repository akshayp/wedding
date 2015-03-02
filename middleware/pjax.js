'use strict';

module.exports = function (req, res, next) {
    res.oldRender = res.render;

    res.render = function (view, options, fn) {
        options = options || {};

        if (req.header('x-requested-with') === 'XMLHttpRequest') {
            options.layout = false;
        }

        res.oldRender(view, options, fn);
    };

    next();
};
