#!/usr/bin/env node
/*jshint unused: false*/

var async = require('async'),
    colors = require('colors'),
    email = require('../lib/email'),
    guests  = require('../lib/guests');

function sendEmail(guest, callback) {

    if (guest.events.reception.attending) {
        email.sendReminder(guest, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('✓'.green + ' Sent Reminder link to: '.yellow + guest.email.cyan);
            }

            callback(null);
        });
    } else {
        console.log('✗'.red + ' Skipped: '.yellow + ' ' + guest.email.green);
        callback(null);
    }
}

function sendRsvpEmails() {
    console.log('Loading invitations from database...'.blue);

    guests.loadGuests(function (err, guests) {
        if (err) { throw err; }

        async.eachSeries(guests, sendEmail, function () {
            console.log('Done!'.green);
            process.exit();
        });
    });
}

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdout.write('Are you sure you want to BLAST OFF REMINDER EMAILS? (yes/no): ');

process.stdin.once('data', function (answer) {
    answer = answer.toString().trim().toLowerCase();

    if (answer === 'yes') {
        sendRsvpEmails();
    } else {
        console.log('Aborting!'.red);
        process.exit();
    }
});
