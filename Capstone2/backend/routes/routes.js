"use strict";

// Routes for User's routes
const jsonschema = require("jsonschema");
const Route = require("../models/route");
const express = require("express");
const router = new express.Router();
const { ensureCorrectUser, ensureLoggedIn } = require("../middleware/auth");
const userRoutesSchema = require("../schemas/userRoute.json");
const { BadRequestError } = require("../expressError");

router.post("/new", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userRoutesSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const { username, routeName, routeNotes, routeDetails } = req.body;
    const route = await Route.addNewRoute(
      username,
      routeName,
      routeNotes,
      routeDetails
    );
    return res.status(201).json({ route });
  } catch (e) {
    return next(e);
  }
});

router.get("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    const routes = await Route.getUserRoutes(req.params.username);

    return res.json({ routes });
  } catch (e) {
    return next(e);
  }
});

router.get(
  "/:username/:id",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      const route = await Route.getRouteDetails(req.params.id);
      return res.json({ route });
    } catch (e) {
      return next(e);
    }
  }
);

router.delete(
  "/:username/:id",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      const route = await Route.deleteRoute(req.params.id);
      return res.json({ route });
    } catch (e) {
      return next(e);
    }
  }
);

module.exports = router;
