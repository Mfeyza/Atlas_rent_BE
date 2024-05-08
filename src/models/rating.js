'use strict'
const {mongoose}=require('../configs/dbConnection')

const RatingSchema= new mongoose.Schema(
    {
        houseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'House',
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        ratedAt: {
            type: Date,
            default: Date.now
        }
    },
    
    {
        timestamps:true,
        collection:'ratings'
    })

    module.exports=mongoose.model('Rating',RatingSchema)