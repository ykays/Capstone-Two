"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { BadRequestError, UnauthorizedError } = require("../expressError");
const { BCRYPT_WORK_FACTOR } = require("../config");
/* 
    User model that includes:
    1. create a new user - insert into users table;
    2. login/authenticate a user

*/
class User {
  /*
    Create/Register new user
    Data: username, password, email, first name, last name, isAdmin
    */

  static async register({
    username,
    password,
    email,
    firstName,
    lastName,
    isAdmin,
  }) {
    const duplicateCheck = await db.query(
      `SELECT username
             FROM users
             WHERE username = $1`,
      [username]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users
             (username,
              password,
              email,
              first_name,
              last_name,
              is_admin)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING username, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin"`,
      [username, hashedPassword, email, firstName, lastName, isAdmin]
    );

    const user = result.rows[0];

    return user;
  }
  /*
Login function that requires: username & password

*/
  static async login(username, password) {
    const result = await db.query(
      `SELECT username,
        password,
        email,
        first_name as "firstName", 
        last_name as "lastName", 
        is_admin as "isAdmin"
        FROM users
        WHERE username = $1`,
      [username]
    );
    const user = result.rows[0];
    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  /*
  Function to mark park visited by the user (or unmark it)
  */
  static async markVisited(username, parkCode, visited) {
    const check = await db.query(
      `SELECT park_code FROM users_parks
    WHERE username = $1 AND park_code=$2`,
      [username, parkCode]
    );
    let results;
    if (check.rows[0]) {
      results = await db.query(
        `UPDATE users_parks SET visited = $1 WHERE username=$2 AND park_code=$3
        RETURNING username, park_code, visited`,
        [visited, username, parkCode]
      );
    } else {
      results = await db.query(
        `INSERT INTO users_parks (username, park_code, visited)
        VALUES ($1, $2, $3)
        RETURNING username, park_code, visited`,
        [username, parkCode, visited]
      );
    }
    const visitedNew = results.rows[0];
    return visitedNew;
  }

  /*
  Function to add notes to the park
  */

  static async saveNote(username, parkCode, note) {
    const check = await db.query(
      `SELECT park_code FROM users_parks
    WHERE username = $1 AND park_code=$2`,
      [username, parkCode]
    );
    let results;
    if (check.rows[0]) {
      results = await db.query(
        `UPDATE users_parks SET park_notes = $1 WHERE username=$2 AND park_code=$3
        RETURNING username, park_code, park_notes`,
        [note, username, parkCode]
      );
    } else {
      results = await db.query(
        `INSERT INTO users_parks (username, park_code, park_notes)
        VALUES ($1, $2, $3)
        RETURNING username, park_code, park_notes`,
        [username, parkCode, note]
      );
    }
    const noteNew = results.rows[0];
    return noteNew;
  }
}

module.exports = User;
