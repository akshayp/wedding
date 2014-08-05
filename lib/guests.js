var config = require('../config'),
    guest = require('./guest'),
    mongoose = require('mongoose'),
    db = mongoose.connection;

mongoose.connect(config.database);
db.on('error', console.error.bind(console, 'Connection error:'));

function loadGuest(id, callback) {
    guest.find({ id: id }, callback);
}

function loadGuestByEmail(email, callback) {
    guest.find({ email: email }, callback);
}

function updateGuest(id, changes, callback) {

    guest.findOneAndUpdate({ id: id }, changes, {new: true}, function(err, guest) {
        if (err) {
            callback(err);
        }
        callback(err, guest);
    });
}

exports.loadGuest        = loadGuest;
exports.loadGuestByEmail = loadGuestByEmail;
exports.updateGuest      = updateGuest;