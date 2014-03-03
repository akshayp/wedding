var mongoose = require('mongoose'),
    guestSchema, Guest;
    
guestSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: String,
    plusone: Boolean
});

Guest = mongoose.model('Guest', guestSchema);

module.exports = Guest;