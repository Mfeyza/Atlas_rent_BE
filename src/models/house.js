'use strict'
const {mongoose}=require('../configs/dbConnection')

const HouseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
    views: [{
        viewerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        viewedAt: {
            type: Date,
            default: Date.now
        }
    }],
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    location:{
        type:String,
        required:true,
        trim:true
    },
    pricePerDay:{
        type:Number,
        required:true
    },
    numberOfRooms:{
        type:Number,
        required:true
    },
    images:[],

    isAvailable:{
        type:Boolean,
        required:true
    },
    seaDistance:{
        type:Number,
        required:true
    },
    isPool:{
        type:Boolean
    },
    isParking:{
        type:Boolean
    },
    isWashingMachine:{
        type:Boolean
    },
    rating:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rating'
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
    },


},{
    timestamps:true,
    collection:'houses'
})
module.exports = mongoose.model('House', HouseSchema)