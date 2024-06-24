const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

async function commonBeforeAll() {
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM parks");
  await db.query("DELETE FROM users_routes");

  await db.query(
    `
        INSERT INTO users(username,
                          password,
                          first_name,
                          last_name,
                          email)
        VALUES ('u1', $1, 'U1F', 'U1L', 'u1@email.com'),
               ('u2', $2, 'U2F', 'U2L', 'u2@email.com')
        RETURNING username`,
    [
      await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
      await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
    ]
  );

  await db.query(
    `INSERT INTO parks(code, name, longitude, latitude, park_type, state)
    VALUES ('code1', 'Park Name One', -85.67330523, 37.5858662, 'National Park', 'MA'),
    ('code2', 'Park Name Two', -85.67330523, 37.5858662, 'National Reserve', 'NH'),
    ('code3', 'Park Name Three', -85.67330523, 37.5858662, 'National Park', 'NH')`
  );

  await db.query(
    `INSERT INTO users_parks(username, park_code, visited, park_notes)
    VALUES ('u1', 'code1', true, 'test notes'),
    ('u1', 'code3', true, 'test notes2')`
  );
  await db.query(
    `INSERT INTO parks_activities( park_code, activity)
    VALUES ('code1', 'Hiking'),
    ('code1', 'Biking'),
    ('code2', 'Hiking')`
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

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
};
