'use strict'

const router=require('express').Router()

router.use('/auth', require('./auth'))
router.use('/users', require('./user'))
router.use('/tokens',require('./token'))
router.use('/houses',require('./house'))


module.exports=router