const {mongoose} = require('../configs/dbConnection');

const ReservationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    car:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
    },
    house: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'House',
      
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    amountHouse: {
        type:Number,
        required: true
    },
    amountCar: {
        type:Number,
        
    },
    bodyCount:{
     type:Number
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
