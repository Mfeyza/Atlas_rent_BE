'use strict'
const House= require('../models/house')
const Rating=require('../models/rating')
const Reservation = require('../models/reservation')

module.exports={
    list: async(req,res)=>{
             /*
            #swagger.tags = ["Houses"]
            #swagger.summary = "List Houses"
            #swagger.description = `
                You can send query with endpoint for filter[], search[], sort[], page and limit.
                <ul> Examples:
                    <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `
        */
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
            // req.errorStatusCode = 401
            // throw new Error('startDate and endDate queries are required.')
            const data= await res.getModelList(House,customFilter,[
                {path:'rating',select:'rating -_id' },
                {path:'userId'}
            ])
            res.status(200).send({
                error:false,
                details:await res.getModelListDetails(House),
                data
            })
        }

        const data= await res.getModelList(House,customFilter,[
            {path:'rating'},
            {path:'userId'}
        ])
        res.status(200).send({
            error:false,
            details:await res.getModelListDetails(House),
            data
        })
    },
    
    create : async(req,res)=>{
         /*
            #swagger.tags = ["Houses"]
            #swagger.summary = "Create House"
        */

        console.log(req.user)
        req.body.createdId = req.user.id
        req.body.updatedId = req.user.id
        const data=await House.create(req.body)
        res.status(201).send({
            error:false,
            data
        })
    },
    read: async (req,res)=>{
           /*
            #swagger.tags = ["Houses"]
            #swagger.summary = "Get Single House"
        */

        const data= await House.findOne({_id:req.params.id})
        res.status(200).send({
            error:false,
            data
        })
    },
    update: async(req,res)=>{
          /*
            #swagger.tags = ["Houses"]
            #swagger.summary = "Update House"
        */
        const data= await House.updateOne({_id:req.params.id},req.body,{runValidators:true})
        res.status(202).send({
            error:false,
            data,
            new: await House.findOne({_id:req.params.id})
        })
    },
    delete: async (req,res)=>{
         /*
            #swagger.tags = ["Houses"]
            #swagger.summary = "Delete House"
        */
        const data= await House.deleteOne({_id:req.params.id})
        await Rating.deleteMany({houseId:req.params.id})
        await Reservation.deleteMany({houseId:req.params.id})

        console.log(data)
        res.status(data.deletedCount? 204 : 404).send({
            error: !data.deletedCount,
            data,
            message:"aaa"
        })
    
    }
        
    }