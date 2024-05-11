const {mongoose} = require('../configs/dbConnection');

const ReservationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    house: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'House',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    amount: {
        type:Number,
        required: true
    },
    createdId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
    collection:'reservations'
});

module.exports = mongoose.model('Reservation', ReservationSchema);
