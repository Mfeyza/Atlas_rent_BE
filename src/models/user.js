'use strict'

const { mongoose } = require("../configs/dbConnection")

const UserSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        index:true
    },
    password:{
        type:String,
        required:true,
        trim:true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        index: true,
    },
    firstName: {
        type: String,
        trim: true,
        required: true
    },

    lastName: {
        type: String,
        trim: true,
        required: true
    },
    image:{
        type:String,
        trim:true
    },
    phoneNumber:{
        type:Number,
        required:true

    },
    isActive: {
        type: Boolean,
        default: true,
    },

    isAdmin: {
        type: Boolean,
        default: false,
    },
    isLandLord:{
        type:Boolean,
        default:false
    }

},{
    timestamps:true,
    collection:'user', 
})

module.exports=mongoose.model('User', UserSchema)