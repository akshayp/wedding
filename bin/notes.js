#!/usr/bin/env node
/* eslint no-unused-vars: 0*/
'use strict';

var colors = require('colors');
var guests = require('../lib/guests');

guests.loadGuests(function (err, data) {
    if (err) {
        console.log('Error loading data'.red);
    }

    for (var guest in data) {
        var oGuest = data[guest];
        if (oGuest.attending !== '' && oGuest.notes) {
            console.log(oGuest.name.yellow + ' said ' + oGuest.notes.blue);
        }
    }
    process.exit();
});
