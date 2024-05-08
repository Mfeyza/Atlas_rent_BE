'use strict'
const Rating= require('../models/rating')

module.exports={
    list: async(req,res)=>{
        const data= await res.getModelList(Rating)
        res.status(200).send({
            error:false,
            details:await res.getModelListDetails(Rating),
            data
        })
    },
    
    create : async(req,res)=>{
        const data=await Rating.create(req.body)
        res.status(201).send({
            error:false,
            data
        })
    },
    read: async (req,res)=>{
        const data= await Rating.findOne({_id:req.params.id})
        res.status(200).send({
            error:false,
            data
        })
    },
    update: async(req,res)=>{
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
    delete: async (req,res)=>{
        const data= await Rating.deleteOne({_id:req.params.id})
        res.status(data.deletedCount? 204 : 404).send({
            error: !data.deletedCount,
            data
        })
    
    }
        
    }