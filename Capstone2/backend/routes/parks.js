"use strict";
/*Routes for parks

- (if user not logged in) get all parks - will get all parks in DB (code, name, coordinates)
    -if filters - then parks will be filtered
- (if user logged in) get all parks 
  - will get all parks in DB as above and also user's visited parks and their notes


*/
const express = require("express");

const ExpressError = require("../expressError");
const Park = require("../models/park");
const { ensureCorrectUser, ensureLoggedIn } = require("../middleware/auth");

const router = new express.Router();

router.get("/", async function (req, res, next) {
  try {
    const parks = await Park.getAllParks(req.query);

    return res.json({ parks });
  } catch (e) {
    return next(e);
  }
});

router.get("/:username", ensureLoggedIn, async function (req, res, next) {
  try {
    const parks = await Park.getAllParksForUser(req.params.username, req.query);
    return res.json({ parks });
  } catch (e) {
    return next(e);
  }
});

router.get("/api/filters", async function (req, res, next) {
  try {
    const filters = await Park.getParksFilterData();
    return res.json(filters);
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
