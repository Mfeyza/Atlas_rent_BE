'use strict'
const Rating= require('../models/rating')
const House=require('../models/house')

module.exports={
    list: async(req,res)=>{
           /*
            #swagger.tags = ["Ratings"]
            #swagger.summary = "List Ratings"
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
        const data= await res.getModelList(Rating)
        res.status(200).send({
            error:false,
            details:await res.getModelListDetails(Rating),
            data
        })
    },
    
    create : async(req,res)=>{
          /*
            #swagger.tags = ["Ratings"]
            #swagger.summary = "Create Rating"
        */
        req.body.createdId=req.body.userId
        const data=await Rating.create(req.body)
        await House.updateOne({_id:data.houseId},{$push:{rating:data}})
        res.status(201).send({
            error:false,
            data
        })
    },
    read: async (req,res)=>{
          /*
            #swagger.tags = ["Ratings"]
            #swagger.summary = "Get Single Rating"
        */
        const data= await Rating.findOne({_id:req.params.id})
        res.status(200).send({
            error:false,
            data
        })
    },
    update: async(req,res)=>{
            /*
            #swagger.tags = ["Ratings"]
            #swagger.summary = "Update Rating"
        */
        const data= await Rating.updateOne({_id:req.params.id},req.body,{runValidators:true})
       if( req.body.userId=req.user._id){
        res.status(202).send({
            error:false,
            data,
            new: await Rating.findOne({_id:req.params.id})
        })
       }else{
        throw new Error('hata')//geri dön
       }
        
    },
    deleteRating: async (req,res)=>{
           /*
            #swagger.tags = ["Ratings"]
            #swagger.summary = "Delete Rating"
        */
        const data= await Rating.deleteOne({_id:req.params.id})
        res.status(data.deletedCount? 204 : 404).send({
            error: !data.deletedCount,
            data
        })
    
    }
        
    }