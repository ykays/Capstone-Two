"use strict";

// Routes for User
const jsonschema = require("jsonschema");
const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const { createToken } = require("../helpers/tokens");
const { ensureCorrectUser, ensureLoggedIn } = require("../middleware/auth");
const userAuthSchema = require("../schemas/userAuth.json");
const userNewSchema = require("../schemas/userNew.json");
const { BadRequestError } = require("../expressError");

/*
Register route that requires: username, password, email, firstName, lastName
Returns token
*/

router.post("/register", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const newUser = await User.register({ ...req.body, isAdmin: false });
    const token = createToken(newUser);
    return res.status(201).json({ token });
  } catch (e) {
    return next(e);
  }
});

router.post("/login", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userAuthSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const { username, password } = req.body;
    const user = await User.login(username, password);
    const token = createToken(user);
    return res.json({ token });
  } catch (e) {
    console.log(e);
    return next(e);
  }
});

router.get("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    const user = await User.getUserDetails(req.params.username);
    return res.json({ user });
  } catch (e) {
    return next(e);
  }
});

router.post("/visited", ensureLoggedIn, async function (req, res, next) {
  try {
    const { username, parkCode, visited } = req.body;
    const results = await User.markVisited(username, parkCode, visited);
    return res.status(201).json(results);
  } catch (e) {
    return next(e);
  }
});

router.post("/notes", ensureLoggedIn, async function (req, res, next) {
  try {
    const { username, parkCode, note } = req.body;
    const results = await User.saveNote(username, parkCode, note);
    return res.status(201).json(results);
  } catch (e) {
    return next(e);
  }
});

router.get(
  "/notes/:username/:parkCode",
  ensureLoggedIn,
  async function (req, res, next) {
    try {
      const results = await User.getNote(
        req.params.username,
        req.params.parkCode
      );
      return res.json(results);
    } catch (e) {
      return next(e);
    }
  }
);

module.exports = router;
