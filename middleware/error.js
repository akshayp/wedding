/* eslint no-unused-vars: 0*/
'use strict';

var BadRequest = require('combohandler').BadRequest;
var STATUS_CODES = require('http').STATUS_CODES;

module.exports = function (err, req, res, next) {
    var status = err.status || 500,
        message;

    if (err instanceof BadRequest) {
        status = 400;
    }

    message = err.message || STATUS_CODES[status];

    res.status(status).format({
        'html': function () {
            res.render('error', {status: message});
        }
    });
};
