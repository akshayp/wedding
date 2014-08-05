module.exports = {
    // FE routes
    index: require('./fe/home'),
    wedding: require('./fe/wedding'),
    logistics: require('./fe/logistics'),
    registry: require('./fe/registry'),
    rsvp: require('./fe/rsvp'),
    // API routes
    invitations: require('./api/invitations'),
    guests: require('./api/guests')
};
