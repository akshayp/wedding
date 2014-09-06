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
    plusone: {
        type: String
    },
    numEmails: {
        type: Number
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    attending: Schema.Types.Mixed,
    invitation: {
        type: String,
        index: true
    },
    events: {
        mehndi: {
            invited: Boolean,
            attending: Schema.Types.Mixed
        },
        ceremony: {
            invited: Boolean,
            attending: Schema.Types.Mixed
        },
        reception: {
            invited: Boolean,
            attending: Schema.Types.Mixed
        }
    },
    notes: String
});

Guest = mongoose.model('Guest', guestSchema);

module.exports = Guest;