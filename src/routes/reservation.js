'use strict'

const router = require('express').Router()
const {isAdmin,isLogin,isLandLord}=require('../middlewares/permissions')
const {read,update,list,deleteReservation,create}=require('../controllers/reservation')

router.route('/')
.get(list)//?
.post(isLogin,create)

router.route('/:id')
.get(isLogin,read)
.put(isLogin,update)
.patch(isAdmin,isLandLord,update)
.delete(deleteReservation)

module.exports=router
