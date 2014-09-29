#!/usr/bin/env node
/*jshint unused: false*/

var fs = require('fs'),
    Table = require('cli-table'),
    config = require('../config'),
    colors = require('colors'),
    guests  = require('../lib/guests'),
    invitedCount = 0,
    attendingCount = 0,
    notattendingCount = 0,
    norsvpCount = 0,
    mehndiCount = 0,
    ceremonyCount = 0,
    receptionCount = 0;

var table = new Table({
    head: ['Name', 'Plus One', 'Mehndi', 'Ceremony', 'Reception'],
    colAligns : [null, null, 'center', 'center', 'center']
});

//guests.loadGuestsByStatus('', function(err, data) {
guests.loadGuests(function(err, data) {
    for (var guest in data) {
        var oGuest = data[guest],
            NOTHING = '-'.yellow,
            CHECKED = '✓'.green,
            WRONG = '✗'.red,
            mehndi = NOTHING,
            ceremony = NOTHING,
            reception = NOTHING;

        invitedCount = invitedCount + 1;

        if (oGuest.attending === true) {
            attendingCount = attendingCount + 1;
        } else if (oGuest.attending === false) {
            notattendingCount = notattendingCount + 1;
        } else {
            norsvpCount = norsvpCount + 1;
        }

        if (oGuest.events.mehndi.attending === true) {
            mehndi = CHECKED;
            mehndiCount = mehndiCount + 1;
        } else if (oGuest.events.mehndi.attending === false) {
            mehndi = WRONG;
        }

        if (oGuest.events.ceremony.attending === true) {
            ceremony = CHECKED;
            ceremonyCount = ceremonyCount + 1;
        } else if (oGuest.events.ceremony.attending === false) {
            ceremony = WRONG;
        }

        if (oGuest.events.reception.attending === true) {
            reception = CHECKED;
            receptionCount = receptionCount + 1;
        } else if (oGuest.events.reception.attending === false) {
            reception = WRONG;
        }

        table.push([
            oGuest.name,
            oGuest.plusone,
            mehndi,
            ceremony,
            reception
        ]);
    }

    console.log('Invites: '.yellow + invitedCount);
    console.log('Accept %: '.yellow + Math.round((attendingCount / invitedCount) * 100) + '%');
    console.log('Reject %: '.yellow + Math.round((notattendingCount / invitedCount) * 100) + '%');
    console.log('Attending: '.yellow + attendingCount);
    console.log('Not Attending: '.yellow + notattendingCount);
    console.log('Not RSVP\'d: '.yellow + norsvpCount);

    console.log('Mehndi: '.yellow + mehndiCount);
    console.log('Ceremony: '.yellow + ceremonyCount);
    console.log('Reception: '.yellow + receptionCount);

    console.log(table.toString());

    process.exit();
});