'use strict'

const router = require('express').Router()
const {isAdmin,isLogin,isLandLord}=require('../middlewares/permissions')
const {read,update,list,delete:deleteRating,create}=require('../controllers/rating')

router.route('/')
.get(list)
.post(isLogin,create)

router.route('/:id')
.get(isLogin,read)
.put(isLogin,update)
.patch(isLogin,update)
.delete(isLogin,deleteRating)

module.exports=router
