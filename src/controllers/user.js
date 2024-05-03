"use Strict";

const User = require("../models/user");
const Token = require("../models/token");
const passwordEncrypt = require("../helpers/passwordEncrypt");

module.exports = {
  list: async (req, res) => {
    const data = await res.getModelList(User);
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(User),
      data,
    });
  },
  create: async (req, res) => {
    req.body.isAdmin = false;
    const data = await User.create(req.body);
    //token
    const tokenData = await Token.create({
      userId: data._id,
      token: passwordEncrypt(data._id + Date.now()),
    });
    res.status(201).send({
      error: false,
      token: tokenData.token,
      data,
    });
  },
  read: async (req, res) => {
    const customFilters = req.user?.isAdmin
      ? { _id: req.params.id }
      : { _id: req.user._id };
    const data = await User.findOne(customFilters);
    res.status(200).send({
      error: false,
      data,
    });
  },
  update: async (req, res) => {
    const customFilters = req.user_.isAdmin
      ? { _id: req.params.id }
      : { _id: req.user._id };
    if (!req.user?.isAdmin) {
      delete req.body.isActive,
        delete req.body.isAdmin,
        delete req.body.isLandLord;
    }
    const data = await User.updateOne(customFilters, req.body, {
      runValidators: true,
    });
    res.status(200).send({
      error: false,
      data,
      new: await User.findOne(customFilters),
    });
  },
  delete: async (req, res) => {
    if (req.params.id != req.user._id) {
      const data = await User.deleteOne({ _id: req.params.id });
      res.status(data.deletedCount ? 204 : 404).send({
        error: !data.deletedCount,
        data,
      });
    } else {
      req.errorStatusCode = 403;
      throw new Error("You cant remove your account");
    }
  },
};
