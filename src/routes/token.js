'use strict'

const router = require('express').Router()
const {isAdmin}=require('../middlewares/permissions')
const {read,update,list,delete:deleteToken,create}=require('../controllers/token')

router.use(isAdmin)
router.route('/')
.get(list)
.post(create)

router.route('/:id')
.get(read)
.put(update)
.patch(update)
.delete(deleteToken)

module.exports=router