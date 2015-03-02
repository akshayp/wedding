#!/usr/bin/env node
/* eslint no-unused-vars: 0*/
'use strict';

var async = require('async');
var colors = require('colors');
var email = require('../lib/email');
var guests = require('../lib/guests');

function sendEmail (guest, callback) {
    email.sendRsvpReminder(guest, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('✓'.green + ' Sent Reminder link to Invitation: '.yellow + guest.email.cyan);
        }

        callback(null);
    });
}

function sendRsvpEmails () {
    console.log('Loading invitations from database...'.blue);

    guests.loadGuestsByStatus('', function (err, data) {
        if (err) { throw err; }

        async.eachSeries(data, sendEmail, function () {
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
