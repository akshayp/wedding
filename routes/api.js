var mongoose = require('mongoose'),
    db = mongoose.connection,
    Guest = require('../models/guest');

mongoose.connect(process.env.CONNECTION_STRING || 'mongodb://localhost/wedding');
db.on('error', console.error.bind(console, 'connection error:'));

module.exports = function (req, res) {
    var oGuest = new Guest({ firstName: 'Akshay', lastName: 'Patel', email: 'foo@foo.com', plusone: false });
    
    /*oGuest.save(function (err) {
        if (err) {
            var errorMessage = err.err;

            if (err.code === 11000) {
                errorMessage = 'Email already registered';
            }

            res.json(500, {
                code: err.code,
                error:  errorMessage
            });
        }
    });*/

    Guest.find(function (err, guests) {
        res.json(guests);
    });
};
