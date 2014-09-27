#!/usr/bin/env node
/*jshint unused: false*/

var async = require('async'),
    colors = require('colors'),
    email = require('../lib/email'),
    guests  = require('../lib/guests');

function sendEmail(guest, callback) {
    email.sendRsvpReminder(guest, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('✓'.green + ' Sent Reminder link to Invitation: '.yellow + guest.email.cyan);
        }

        callback(null);
    });
}

function sendRsvpEmails() {
    console.log('Loading invitations from database...'.blue);

    guests.loadGuestsByStatus("", function (err, guests) {
        if (err) { throw err; }

        async.eachSeries(guests, sendEmail, function () {
            console.log('Done!'.green);
            process.exit();
        });
    });
}

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdout.write('Are you sure you want to BLAST OFF EMAILS? (yes/no): ');

process.stdin.once('data', function (answer) {
    answer = answer.toString().trim().toLowerCase();

    if (answer === 'yes') {
        sendRsvpEmails();
    } else {
        console.log('Aborting!'.red);
        process.exit();
    }
});
