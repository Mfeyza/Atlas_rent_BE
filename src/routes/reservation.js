'use strict'

const router = require('express').Router()
const {isAdmin,isLogin,isLandLord}=require('../middlewares/permissions')
const {read,update,list,delete:deleteReservation,create}=require('../controllers/reservation')

router.route('/')
.get(isAdmin,list)//?
.post(isLogin,create)

router.route('/:id')
.get(isLogin,read)
.put(isAdmin,isLandLord,update)
.patch(isAdmin,isLandLord,update)
.delete(isAdmin,isLandLord,deleteReservation)

module.exports=router
