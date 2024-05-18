"use strict";

const router = require("express").Router();

router.use("/auth", require("./auth"));
router.use("/users", require("./user"));
router.use("/tokens", require("./token"));
router.use("/houses", require("./house"));
router.use("/cars", require("./car"));
router.use("/reservations", require("./reservation"));
router.use("/ratings", require("./rating"));
router.use("/documents", require("./document"));

module.exports = router;
