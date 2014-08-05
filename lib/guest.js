var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    guestSchema, Guest;
    
guestSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    guests: {
        type: Array
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    plusone: Boolean,
    rsvpd: Boolean,
    status: Boolean,
    invitation: {
        type: String,
        index: true
    },
    events: Array
});

Guest = mongoose.model('Guest', guestSchema);

module.exports = Guest;