"use strict";
/*Routes for parks
routes: 
parks/api/post & parks/api/activity/post are only for admin work, user will not have access

other routes:
- (if user not logged in) get all parks - will get all parks in DB (code, name, coordinates)
    -if filters - then parks will be filtered
- (if user logged in) get all parks 
  - will get all parks in DB as above and also user's visited parks and their notes


*/
const express = require("express");

const ExpressError = require("../expressError");
const Park = require("../models/park");

const router = new express.Router();

router.post("/api/post", async function (req, res, next) {
  try {
    const park = await Park.createPark(req.body);
    return res.status(201).json({ park });
  } catch (e) {
    return next(e);
  }
});

router.post("/api/activity/post", async function (req, res, next) {
  try {
    const activity = await Park.addParkActivity(req.body);
    return res.status(201).json({ activity });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
