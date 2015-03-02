#!/usr/bin/env node
/* eslint no-unused-vars: 0*/
'use strict';

var config = require('../config');
var _ = require('lodash');
var colors = require('colors');
var csvjson = require('csvjson');
var guests = require('../lib/guests');
var email = require('../lib/email');
var Guest = require('../lib/schema');

function importData () {
    var list = csvjson.toObject('./database.csv').output,
        collection = [];

    guests.loadGuests(function (err, data) {
        var offset = data.length + 1;

        list.forEach(function (guest, index) {
            var obj = _.find(data, function (guestObj) {
                return guestObj.email === guest.email;
            });

            if (obj) {
                console.log('✗'.red + ' Skipped: '.yellow + ' ' + guest.name.green);
                return;
            }

            var oGuest = new Guest({
                id: index + offset,
                name: guest.name,
                plusone: '',
                numEmails: 0,
                email: guest.email,
                attending: '',
                invitation: email.encipherId(guest.email),
                events: {
                    mehndi: {
                        invited: guest.mehndi === 'Yes',
                        attending: ''
                    },
                    ceremony: {
                        invited: guest.wedding === 'Yes',
                        attending: ''
                    },
                    reception: {
                        invited: guest.wedding === 'Yes',
                        attending: ''
                    }
                },
                notes: ''
            });

            console.log('✓'.green + ' Added: '.yellow + ' ' + guest.name.green);
            collection.push(oGuest);
        });

        if (collection.length === 0) {
            process.exit();
        }

        Guest.create(collection, function (createErr) {
            if (createErr) {
                console.log('Error while saving documents:'.red);
                console.log(err);
            }
            process.exit();
        });
    });
}


process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdout.write('Do you want to import data into ' + config.database + ' ? (yes/no): ');

process.stdin.once('data', function (answer) {
    answer = answer.toString().trim().toLowerCase();

    if (answer === 'yes') {
        importData();
    } else {
        console.log('Aborting!'.red);
        process.exit();
    }
});
