"use strict"

const router = require('express').Router()
const {isAdmin,isLogin,isLandLord}=require("../middlewares/permissions")
const {list,read,create,update,deleteCar}=require("../controllers/car")

router.route("/").get(list).post(create)
router.route("/:id").get(isLogin,read).put(update).patch(isAdmin,update).delete(isAdmin,deleteCar)

module.exports = router
