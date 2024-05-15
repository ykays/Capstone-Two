"use strict";

const db = require("../db.js");
const User = require("../models/user");

const { createToken } = require("../helpers/tokens");

async function commonBeforeAll() {
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM parks");
  await db.query("DELETE FROM users_parks");
  await db.query("DELETE FROM users_routes");

  await User.register({
    username: "u1",
    firstName: "U1F",
    lastName: "U1L",
    email: "user1@user.com",
    password: "password1",
    isAdmin: false,
  });
  await User.register({
    username: "u2",
    firstName: "U2F",
    lastName: "U2L",
    email: "user2@user.com",
    password: "password2",
    isAdmin: false,
  });
  await User.register({
    username: "u3",
    firstName: "U3F",
    lastName: "U3L",
    email: "user3@user.com",
    password: "password3",
    isAdmin: false,
  });

  await db.query(
    `INSERT INTO parks(code, name, longitude, latitude, park_type, state)
    VALUES ('code1', 'Park Name One', -85.67330523, 37.5858662, 'National Park', 'MA'),
    ('code2', 'Park Name Two', -85.67330523, 37.5858662, 'National Reserve', 'NH'),
    ('code3', 'Park Name Three', -85.67330523, 37.5858662, 'National Park', 'NH'),
    ('code4', 'Park Name Four', -85.67330523, 37.5858662, 'National Park', 'MA'),
    ('code5', 'Park Name Five', -85.67330523, 37.5858662, 'National Reserve', 'MA'),
    ('code6', 'Park Name Six', -85.67330523, 37.5858662, 'National Park', 'NH'),
    ('code7', 'Park Name Seven', -85.67330523, 37.5858662, 'National Park', 'MA')`
  );

  await db.query(
    `INSERT INTO users_parks(username, park_code, visited, park_notes)
    VALUES ('u1', 'code1', true, 'u1 park note'),
    ('u1', 'code3', true, 'test notes2')`
  );
  await db.query(
    `INSERT INTO parks_activities( park_code, activity)
    VALUES ('code1', 'Hiking'),
    ('code1', 'Biking'),
    ('code3', 'Hiking'),
    ('code4', 'Climbing'),
    ('code6', 'Hiking')`
  );
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

const u1Token = createToken({ username: "u1" });
const u2Token = createToken({ username: "u2" });

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
};
