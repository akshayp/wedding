var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    guestSchema, Guest;
    
guestSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    guests: {
        type: Boolean
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    rsvpd: Boolean,
    coming: Boolean,
    invitation: {
        type: String,
        index: true
    },
    events: Array
});

Guest = mongoose.model('Guest', guestSchema);

module.exports = Guest;