var fe = require('./fe');

module.exports = {
    // FE routes
    index: fe.home,
    wedding: fe.wedding,
    logistics: fe.logistics,
    registry: fe.registry,
    rsvp: require('./fe/rsvp'),
    // API routes
    invitations: require('./api/invitations'),
    guests: require('./api/guests')
};
