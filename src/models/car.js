"use strict"

const { mongoose } = require('../configs/dbConnection')


const CarSchema= new mongoose.Schema({

    plateNo:{
        type:String,
        trim:true,
        unique:true

    },
    brand:{
        type:String,
        trim:true,
        required:true
    },
    model:{
        type:String,
        trim:true,
        required:true
    },
    year:{
        type:Number,
        required:true,
        max:new Date().getFullYear(),
        min:2012
    },
    isAutomatic:{
        type:Boolean,
        default:false,
        required:true
    },
    fuelType:{
        type:String,
        required:true,
        enum : ["Diesel","Gasoline","Hybrid"],
    },
    pricePerDay:{
        type:Number,
        required:true
    },
    isPublish:{
        type:Boolean,
        default:true
    },
    imagesUrl:{
     type:Array,
     default:[]
    },
    images:{
        type:Array,
        default:[]
    },
    createdId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    updatedId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },

},

{
collection:'cars', timestamps:true
})

module.exports=mongoose.model('Car',CarSchema)