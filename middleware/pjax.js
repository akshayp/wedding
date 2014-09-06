module.exports = function (req, res, next) {
    res.render_ = res.render;

    res.render = function (view, options, fn) {
        options = options || {};

        if (req.header('x-requested-with') === 'XMLHttpRequest') {
            options.layout = false;
        }

        res.render_(view, options, fn);
    };

    next();
};