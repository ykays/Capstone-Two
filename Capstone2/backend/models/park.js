"use strict";

const db = require("../db");
const ExpressError = require("../expressError");
const { createFiltersQuery } = require("../helpers/sqlFilters");

class Park {
  /*
  Gettting all parks from DB
  By default:
  Data to be returned: code, name, longitude, latitude, park_type, state;

  Conditions:
  1. If user is logged in, additionally column visited from users_parks will also be returned
  2. If user provided any filters (state, type, activity), the data will be filtered 

*/

  //base scenario - fetching all parks
  static async getAllParks(filters = {}) {
    //if there are no filters
    if (Object.keys(filters).length === 0) {
      const res = await db.query(
        `SELECT code, name, longitude, latitude, 
        park_type as "parkType", state
        FROM parks`
      );
      return res.rows;
    }
    //if filters are provided
    const filterResults = createFiltersQuery(filters);

    const results = await db.query(
      filterResults.query,
      filterResults.queryValues
    );

    return results.rows;
  }

  // if user is logged in, get also visited "true" flag
  static async getAllParksForUser(username, filters = {}) {
    //if there are no filters
    if (Object.keys(filters).length === 0) {
      const res = await db.query(
        `WITH users_visited as(
          SELECT park_code, visited FROM users_parks 
          WHERE username= $1 AND visited='t'
        )
        SELECT code, name, longitude, latitude, park_type as "parkType", state, COALESCE(visited, false) as "visited"
        FROM parks p LEFT JOIN users_visited v ON p.code=v.park_code`,
        [username]
      );
      return res.rows;
    }
    //if filters are provided
    const res = await db.query(
      `SELECT park_code, visited FROM users_parks 
      WHERE username= $1 AND visited='t'`,
      [username]
    );
    const visited = res.rows;

    const filterResults = createFiltersQuery(filters);

    const results = await db.query(
      filterResults.query,
      filterResults.queryValues
    );
    //adding visited flag to the results
    const parks = results.rows.map((result) => {
      result.visited = false;
      for (let el of visited) {
        if (el.park_code === result.code) {
          result.visited = true;
        }
      }
      return result;
    });

    return parks;
  }
}

module.exports = Park;
