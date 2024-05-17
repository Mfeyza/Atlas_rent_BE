'use strict'

const router = require('express').Router()
const {isAdmin,isLogin,isLandLord}=require('../middlewares/permissions')
const {read,update,list,deleteReservation,create}=require('../controllers/reservation')

router.route('/')
.get(list)//?
.post(isLogin,create)

router.route('/:id')
.get(isLogin,read)
.put(isAdmin,isLandLord,update)
.patch(isAdmin,isLandLord,update)
.delete(isAdmin,isLandLord,deleteReservation)

module.exports=router
