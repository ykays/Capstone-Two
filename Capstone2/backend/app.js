"use strict";

/** Express app for pin the park project. */

const express = require("express");
const cors = require("cors");

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
const usersParksRoutes = require("./routes/routes");
const usersRoutes = require("./routes/users");
const parksRoutes = require("./routes/parks");

const app = express();

app.use(cors());
app.use(express.json());
app.use(authenticateJWT);

app.use("/users", usersRoutes);
app.use("/parks", parksRoutes);
app.use("/routes", usersParksRoutes);

/** 404 handler */
app.use(function (req, res, next) {
  const err = new NotFoundError("Not Found", 404);
  return next(err);
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
