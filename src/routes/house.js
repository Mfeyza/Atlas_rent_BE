'use strict'
const router = require('express').Router()
const {isAdmin,isLogin,isLandLord}=require('../middlewares/permissions')
const {read,update,list,delete:deleteHouse,create}=require('../controllers/house')

router.route('/')
    .get( list)  
    .post(create)  

router.route('/:id')
    .get(isLogin, read)  
    .put(isLandLord,  update)  
    .patch(isLandLord ,update)  
    .delete(isLandLord, deleteHouse)  

module.exports = router