var config = require('../config'),
    guest = require('./schema'),
    mongoose = require('mongoose'),
    db = mongoose.connection;

mongoose.connect(config.database);
db.on('error', console.error.bind(console, 'Connection error:'));

function loadGuests(callback) {
    guest.find(callback);
}

function loadGuest(id, callback) {
    guest.find({ id: id }, function(err, data) {
        callback(err, data[0]);
    });
}

function updateGuest(id, changes, callback) {
    guest.findOneAndUpdate({ id: id }, changes, {}, function(err, guest) {
        if (err) {
            callback(err);
        }
        callback(err, guest);
    });
}

function loadGuestByEmail(email, callback) {
    guest.find({ email: email }, function(err, data) {
        callback(err, data[0]);
    });
}

function updateInvitation(id, changes, callback) {
    guest.findOneAndUpdate({ invitation: id }, changes, {}, function(err, guest) {
        callback(err, guest);
    });
}

function loadGuestByInvitation(invitation, callback) {
    guest.find({ invitation: invitation }, function(err, data) {
        callback(err, data[0]);
    });
}

exports.loadGuest        = loadGuest;
exports.loadGuests       = loadGuests;
exports.loadGuestByEmail = loadGuestByEmail;
exports.updateGuest      = updateGuest;
exports.updateInvitation = updateInvitation;
exports.loadGuestByInvitation   = loadGuestByInvitation;