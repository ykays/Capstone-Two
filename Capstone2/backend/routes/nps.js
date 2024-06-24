"use strict";
/*
Route for external API call to get park details
*/

const express = require("express");
const axios = require("axios");
const process = require("process");

require("dotenv").config();

const APIKey = process.env.API_KEY;

const router = new express.Router();

router.get("/:parkCode", async function (req, res, next) {
  try {
    const results = await axios.get(
      `https://developer.nps.gov/api/v1/parks?parkCode=${req.params.parkCode}&api_key=${APIKey}`
    );
    return res.json(results.data);
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
