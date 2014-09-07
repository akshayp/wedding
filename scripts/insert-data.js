#!/usr/bin/env node
/*jshint unused: false*/
var colors = require('colors'),
    guests  = require('../lib/guests'),
    Guest  = require('../lib/schema');

Guest.find(function (err, guests) {
    console.dir(guests);
});

function importData() {
    var oGuest = new Guest({ firstName: 'Akshay', lastName: 'Patel', email: 'foo@foo.com', plusone: false });
    
    oGuest.save(function (err) {
        if (err) {
            var errorMessage = err.err;

            if (err.code === 11000) {
                errorMessage = 'Email already registered';
            }
        }

        Guest.find(function (err, guests) {
            console.dir(guests);
        });
    });
}


process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdout.write('Do you want to import data? (yes/NO): ');

process.stdin.once('data', function (answer) {
    answer = answer.toString().trim().toLowerCase();

    if (answer === 'yes') {
        importData();
    } else {
        console.log('Aborting!'.red);
        process.exit();
    }
});
