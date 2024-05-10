"use strict";
const Reservation = require("../models/reservation");
const House = require("../models/house");

module.exports = {
  list: async (req, res) => {
    let customFilter = {};
    if (!req.user.isAdmin && !req.user.isLandLord) {
      customFilter = { userId: req.user._id };
    }
    const data = await res.getModelList(Reservation, customFilter, [
      { path: "userId" },
      { path: "houseId" },
    ]);
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Reservation, customFilter),
      data,
    });
  },

  create: async (req, res) => {
    if (!req.body?.houseId) {
      throw new Error("Please enter houseId");
    }
    req.body.createdId = req.user._id;
    req.body.updatedId = req.user._id;

    if ((!req.user.isAdmin && !req.user.isLandLord) || !req.body?.userId) {
      req.body.userId = req.user._id;
    }
    if (!req.body.amount) {
      const houseData = await House.findOne({ _id: req.body.houseId });
      const startDate = new Date(req.body.startDate);
      const endDate = new Date(req.body.endDate);
      const days = (endDate - startDate) / (1000 * 60 * 60 * 24);
      req.body.amount = houseData.pricePerDay * days;
    }
    const userReservationInDates = await Reservation.findOne({
      userId: req.body.userId,
      $nor: [
        { starDate: { $gt: req.body.endDate } },
        { endDate: { $lt: req.body.startDate } },
      ],
    });
    if (userReservationInDates) {
      res.errorStatusCode = 400;
      throw new Error(
        "It cannot be added because there is another reservation with the same date.",
        { cause: { userReservationInDates: userReservationInDates } }
      );
    } else {
      const data = await Reservation.create(req.body);

      res.status(201).send({
        error: false,
        data,
      });
    }
  },
  read: async (req, res) => {
    let customFilter = {};
    if (!req.user.isAdmin && !req.user.isLandLord) {
      customFilter = { userId: req.user._id };
    }
    const data = await Reservation.findOne({
      _id: req.params.id,
      ...customFilter,
    }).populate([
      { path: "userId", select: "username firstName lastName image" },
      { path: "houseId" },
    ]);
    res.status(200).send({
      error: false,
      data,
    });
  },
  update: async (req, res) => {
    if (!req.body?.houseId) {
      throw new Error("Please enter houseId");
    }
    if (!req.user.isAdmin) {
      delete req.body.userId;
    }
    if (!req.body.amount) {
      const houseData = await House.findOne({ _id: req.body.houseId });
      const startDate = new Date(req.body.startDate);
      const endDate = new Date(req.body.endDate);
      const days = (endDate - startDate) / (1000 * 60 * 60 * 24);
      req.body.amount = houseData.pricePerDay * days;
    }
    const data = await Reservation.updateOne({ _id: req.params.id }, req.body, {
      runValidators: true,
    });
    res.status(202).send({
      error: false,
      data,
      new: await Reservation.findOne({ _id: req.params.id }),
    });
  },
  delete: async (req, res) => {
    const data = await Reservation.deleteOne({ _id: req.params.id });
    console.log(data)
    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      data,
      message:"Data deleted"
    });
  },
};
