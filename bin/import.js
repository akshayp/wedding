#!/usr/bin/env node
/*jshint unused: false*/

var fs = require('fs'),
    config = require('../config'),
    _ = require('lodash'),
    colors = require('colors'),
    csvjson = require('csvjson'),
    guests  = require('../lib/guests'),
    email  = require('../lib/email'),
    Guest  = require('../lib/schema'),
    data = fs.readFileSync('database.csv').toString();

function importData() {
    var list = csvjson.toObject('./database.csv').output,
        collection = [];

    guests.loadGuests(function(err, data){
        var offset = data.length + 1;

        list.forEach(function(guest, index) {
            var obj = _.find(data, function(obj) { return obj.email === guest.email });

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

        Guest.create(collection, function(err, data) {
            if (err) {
                console.log('Error while saving documents:'.red);
                console.log(err)
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
