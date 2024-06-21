"use strict";

function createFiltersQuery(filters) {
  let query = filters.activity
    ? `SELECT DISTINCT (code), name, longitude, latitude,
park_type as "parkType", state
FROM parks p JOIN parks_activities a ON p.code = a.park_code`
    : `SELECT code, name, longitude, latitude,
park_type as "parkType", state
FROM parks`;

  let whereExpressions = [];
  let queryValues = [];

  for (let [key, val] of Object.entries(filters)) {
    if (typeof val === "string") {
      queryValues.push(val);
      whereExpressions.push(`${key} = $${queryValues.length}`);
    } else {
      let perc = "";
      for (let i = 0; i < val.length; i++) {
        queryValues.push(val[i]);
        if (i === val.length - 1) {
          perc += `$${queryValues.length}`;
        } else {
          perc += `$${queryValues.length},`;
        }
      }
      whereExpressions.push(`${key} IN (${perc})`);
    }
  }

  if (whereExpressions.length > 0) {
    query += " WHERE " + whereExpressions.join(" AND ");
  }
  return { query, queryValues };
}

module.exports = { createFiltersQuery };
