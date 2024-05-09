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

router.route("/").get(list).post(create);
router
  .route("/:id")
  .get(read)
  .put(isLogin, update)
  .patch(isLogin, update)
  .delete(deleteUser);

module.exports = router;
