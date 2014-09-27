#!/usr/bin/env node
/*jshint unused: false*/

var fs = require('fs'),
    config = require('../config'),
    colors = require('colors'),
    guests  = require('../lib/guests');

function importData() {

    guests.loadGuests(function(err, data) {
        for (var guest in data) {
            var oGuest = data[guest];
            if (oGuest.attending !== '' && oGuest.notes) {
                console.log(oGuest.name.yellow + " said " + oGuest.notes.blue);
            }
        }
        process.exit();
    });
}


process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdout.write('Do you want to log data into the console ? (yes/no): ');

process.stdin.once('data', function (answer) {
    answer = answer.toString().trim().toLowerCase();

    if (answer === 'yes') {
        importData();
    } else {
        console.log('Aborting!'.red);
        process.exit();
    }
});
