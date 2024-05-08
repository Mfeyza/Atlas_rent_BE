'use strict'
const House= require('../models/house')
const Rating=require('../models/rating')
const Reservation = require('../models/reservation')

module.exports={
    list: async(req,res)=>{
        let customFilter = { isAvailable: true }
        const { startDate: getStartDate, endDate: getEndDate } = req.query
         if (getStartDate && getEndDate) {
            const reservedHouses = await Reservation.find({
                $nor: [
                    { startDate: { $gt: getEndDate } },
                    { endDate: { $lt: getStartDate } } 
                ]
            }, { _id: 0, houseId: 1 }).distinct('houseId')
          
            if (reservedHouses.length) {
                customFilter._id = { $nin: reservedHouses }
            }
        } else {
            req.errorStatusCode = 401
            throw new Error('startDate and endDate queries are required.')
        }

        const data= await res.getModelList(House,customFilter,[
            {path:'rating'}
        ])
        res.status(200).send({
            error:false,
            details:await res.getModelListDetails(House),
            data
        })
    },
    
    create : async(req,res)=>{
        const data=await House.create(req.body)
        res.status(201).send({
            error:false,
            data
        })
    },
    read: async (req,res)=>{
        const data= await House.findOne({_id:req.params.id})
        res.status(200).send({
            error:false,
            data
        })
    },
    update: async(req,res)=>{
        const data= await House.updateOne({_id:req.params.id},req.body,{runValidators:true})
        res.status(202).send({
            error:false,
            data,
            new: await House.findOne({_id:req.params.id})
        })
    },
    delete: async (req,res)=>{
        const data= await House.deleteOne({_id:req.params.id})
        res.status(data.deletedCount? 204 : 404).send({
            error: !data.deletedCount,
            data
        })
    
    }
        
    }