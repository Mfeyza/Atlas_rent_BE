"use strict";
const Reservation = require("../models/reservation");
const House = require("../models/house");
const Car=require("../models/car")

module.exports = {
  list: async (req, res) => {
      /*
            #swagger.tags = ["Reservations"]
            #swagger.summary = "List Reservations"
            #swagger.description = `
                You can send query with endpoint for filter[], search[], sort[], page and limit.
                <ul> Examples:
                    <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `
        */
  //  if (req.query.author) {
  //  const data = await Reservation.find({ userId: req.query.author });
  console.log(req.user)
    let customFilter = {};
    if (!req.user.isAdmin && !req.user.isLandLord) {
      customFilter = { userId: req.user._id };
    }
    if (req.query.author) {
      const data = await Reservation.find({ userId: req.query.author }).populate([
        { path: "userId", select: "username firstName lastName image" },
        { path: "house" },
        {path:"car"}
      ])

      res.status(200).send({
        error: false,
        details: await res.getModelListDetails(Reservation, {
          userId: req.query.author,
        }),
        data,
      });
    }else{
    
    const data = await res.getModelList(Reservation, customFilter, [
      { path: "userId" },
      { path: "house" },
    ]);
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Reservation, customFilter),
      data,
    });
    console.log(req.params)
  }},

  create: async (req, res) => {
       /*
            #swagger.tags = ["Reservations"]
            #swagger.summary = "Create Reservation"
        */
   
    req.body.createdId = req.user._id;
    req.body.updatedId = req.user._id;

    if ((!req.user.isAdmin && !req.user.isLandLord) || !req.body?.userId) {
      req.body.userId = req.user._id;
    }
    if (!req.body.amountHouse) {
      const houseData = await House.findOne({ _id: req.body.house });
      const startDate = new Date(req.body.startDate);
      const endDate = new Date(req.body.endDate);
      const days = (endDate - startDate) / (1000 * 60 * 60 * 24);
      req.body.amountHouse = houseData.pricePerDay * days;
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
      /*
            #swagger.tags = ["Reservations"]
            #swagger.summary = "Get Single Reservation"
        */
    let customFilter = {};
    if (!req.user.isAdmin && !req.user.isLandLord) {
      customFilter = { userId: req.user._id };
    }
    console.log(req.params);
    const data = await Reservation.findOne({
      _id: req.params.id,
      ...customFilter,
    }).populate([
      { path: "userId", select: "username firstName lastName image" },
      { path: "house" },
      {path:"car"}
    ]);
    res.status(200).send({
      error: false,
      data,
    });
  },
  update: async (req, res) => {
     /*
            #swagger.tags = ["Reservations"]
            #swagger.summary = "Update Reservation"
        */
    
    if (!req.user.isAdmin) {
      delete req.body.userId;
    }
    
    if (!req.body.amountHouse && req.body.house) {
      const houseData = await House.findOne({ _id: req.body.house });
      const startDate = new Date(req.body.startDate);
      const endDate = new Date(req.body.endDate);
      const days = (endDate - startDate) / (1000 * 60 * 60 * 24);
      req.body.amountHouse = houseData.pricePerDay * days;
     
    }
    
    if (!req.body.amountCar && req.body.car) {
      const carData = await Car.findOne({ _id: req.body.car });
      const startDate = new Date(req.body.startDate);
      const endDate = new Date(req.body.endDate);
      const days = (endDate - startDate) / (1000 * 60 * 60 * 24);
      req.body.amountCar = carData.pricePerDay * days;
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
  deleteReservation: async (req, res) => {
     /*
            #swagger.tags = ["Reservations"]
            #swagger.summary = "Delete Reservation"
        */
    const data = await Reservation.deleteOne({ _id: req.params.id });
    console.log(data)
    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      data,
      message:"Data deleted"
    });
  },
};
