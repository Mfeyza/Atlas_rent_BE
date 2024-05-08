"use strict";

const router = require("express").Router();
const { isAdmin, isLogin, isLandLord } = require("../middlewares/permissions");
const {
  list,
  create,
  update,
  read,
  delete: deleteUser,
} = require("../controllers/user");

router.route("/").get(isLogin, list).post(create);
router
  .route("/:id")
  .get(isLogin, read)
  .put(isLogin, update)
  .patch(isLogin, update)
  .delete(isAdmin, deleteUser);

module.exports = router;
