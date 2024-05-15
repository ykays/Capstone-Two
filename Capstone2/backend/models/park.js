"use strict";

const db = require("../db");
const ExpressError = require("../expressError");

class Park {
  /*
    Create a park from external National Park API that will be triggered by job and/or admin
    Regular user cannot add a new park & there will be no front-end to add it 

    data should have: code, name, long, lat, park_type, state
    if the record for the park already exists, the process will delete and insert most recent one

    */

  static async createPark({ code, name, longitude, latitude, type, state }) {
    this.deletePark(code);
    const results = await db.query(
      `INSERT INTO parks
        (code, name, longitude, latitude, park_type, state)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING code, name, longitude, latitude, park_type, state`,
      [code, name, longitude, latitude, type, state]
    );
    const park = results.rows[0];
    return park;
  }

  static async deletePark(code) {
    await db.query(`DELETE FROM parks WHERE code=$1`, [code]);
  }

  /*
  Adding park activities
  Similar to Park - it will be done by admin, no user interface to add park's activity

    data should have: park code, activity
    if the records for parks are deleted, the records for park acitivties will also be deleted due to relationship

  */
  static async addParkActivity({ code, activity }) {
    const results = await db.query(
      `INSERT INTO parks_activities
        (park_code, activity)
        VALUES ($1, $2)
        RETURNING id, park_code, activity`,
      [code, activity]
    );
    const res = results.rows[0];
    return res;
  }
}

module.exports = Park;
