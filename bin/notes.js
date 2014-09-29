#!/usr/bin/env node
/*jshint unused: false*/

var fs = require('fs'),
    config = require('../config'),
    colors = require('colors'),
    guests  = require('../lib/guests');

guests.loadGuests(function(err, data) {
    for (var guest in data) {
        var oGuest = data[guest];
        if (oGuest.attending !== '' && oGuest.notes) {
            console.log(oGuest.name.yellow + " said " + oGuest.notes.blue);
        }
    }
    process.exit();
});