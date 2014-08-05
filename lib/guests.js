var config = require('../config'),
    guest = require('./guest'),
    mongoose = require('mongoose'),
    db = mongoose.connection;

mongoose.connect(config.database);
db.on('error', console.error.bind(console, 'Connection error:'));

function loadGuests(id, callback) {
    guest.find(callback);
}

function loadGuest(id, callback) {
    guest.find({ id: id }, callback);
}

function loadGuestByEmail(email, callback) {
    guest.find({ email: email }, callback);
}

function updateGuest(id, changes, callback) {
    guest.findOneAndUpdate({ id: id }, changes, {}, function(err, guest) {
        if (err) {
            callback(err);
        }
        callback(err, guest);
    });
}

function updateInvitation(id, changes, callback) {
    guest.findOneAndUpdate({ invitation: id }, changes, {}, function(err, guest) {
        callback(err, guest);
    });
}

function loadInvitation(id, callback) {
    guest.find({ invitation: id }, callback);
}

exports.loadGuest        = loadGuest;
exports.loadGuests       = loadGuests;
exports.loadGuestByEmail = loadGuestByEmail;
exports.updateGuest      = updateGuest;
exports.updateInvitation = updateInvitation;
exports.loadInvitation   = loadInvitation;