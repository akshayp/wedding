var config = require('../config'),
    guest = require('./schema'),
    mongoose = require('mongoose'),
    db = mongoose.connection;

mongoose.connect(config.database);
db.on('error', console.error.bind(console, 'Connection error:'));

function loadGuests(callback) {
    guest.find(callback);
}

function loadGuestsByStatus(attending, callback) {
    guest.find({ attending: attending }, function(err, data) {
        callback(err, data);
    });
}

function loadGuestById(id, callback) {
    guest.find({ id: id }, function(err, data) {
        callback(err, data[0]);
    });
}

function loadGuestByEmail(email, callback) {
    guest.find({ email: email }, function(err, data) {
        callback(err, data[0]);
    });
}

function loadGuestByInvitation(invitation, callback) {
    guest.find({ invitation: invitation }, function(err, data) {
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

exports.loadGuests              = loadGuests;
exports.loadGuestsByStatus      = loadGuestsByStatus;
exports.loadGuestById           = loadGuestById;
exports.loadGuestByEmail        = loadGuestByEmail;
exports.loadGuestByInvitation   = loadGuestByInvitation;
exports.updateGuest             = updateGuest;