'use strict'
const router = require('express').Router()
const {isAdmin,isLogin,isLandLord}=require('../middlewares/permissions')
const {read,update,list,delete:deleteHouse,create}=require('../controllers/house')

router.route('/')
    .get(isLogin, list)  
    .post(isAdmin, isLandLord, create)  

router.route('/:id')
    .get(isLogin, read)  
    .put(isLandLord, isAdmin, update)  
    .patch(isLandLord, isAdmin, update)  
    .delete(isLandLord, isAdmin, deleteHouse)  

module.exports = router