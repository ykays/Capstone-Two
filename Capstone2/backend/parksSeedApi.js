const axios = require("axios");
const process = require("process");
const db = require("./db");

require("dotenv").config();

const APIKey = process.env.API_KEY;

/*
    The file that will be used by admin to fetch data for Parks and their Activities
    First - it gets all data from NP API (API KEY is needed here, 
        limit by default on NP website is set to 50 so adding this changing it to 1000 to make sure to fetch all recs),
    then for each park we will process the insert to parks table and once that is done, 
    activities for each park will be inserted into parks_activities 
    Note: parks_activities table needs park_code so park needs to be created first 
*/

const url = `https://developer.nps.gov/api/v1/parks?limit=1000&api_key=${APIKey}`;

async function getParks() {
  try {
    const results = await axios.get(url);
    await db.query(`DELETE FROM parks`);
    console.log("All records deleted");
    processResultsParks(results.data.data);
  } catch (e) {
    console.log(`Error fetching ${url}`, e);
  }
}

function processResultsParks(data) {
  const parks = data.map((park) => {
    const el = {
      code: park.parkCode,
      name: park.fullName,
      longitude: Number(park.longitude),
      latitude: Number(park.latitude),
      park_type: park.designation,
      state: park.states,
    };
    return el;
  });

  const activities = data.map((park) => {
    const el = {
      code: park.parkCode,
      activity: park.activities,
    };
    return el;
  });

  createQueryParks(parks, activities);
}

function createQueryParks(parks, activities) {
  console.log("Creating query for Parks");
  let query = `
    INSERT INTO parks
    (code, name, longitude, latitude, park_type, state)
    VALUES`;

  let i = 1;
  for (let j = 0; j < parks.length; j++) {
    if (j === parks.length - 1) {
      query += `($${i}, $${i + 1}, $${i + 2}, $${i + 3}, $${i + 4}, $${i + 5})`;
    } else {
      query += `($${i}, $${i + 1}, $${i + 2}, $${i + 3}, $${i + 4}, $${
        i + 5
      }),`;
    }

    i += 6;
  }

  let values = [];
  for (let park of parks) {
    for (let value of Object.values(park)) {
      values.push(value);
    }
  }
  insertParks(query, values, activities);
}

async function insertParks(query, values, activities) {
  await db.query(query, values);
  console.log("All Parks are inserted");
  processParkActivity(activities);
}

let parkActivities = [];
function processParkActivity(activities) {
  for (let obj of activities) {
    for (let activity of obj.activity) {
      parkActivities.push({ code: obj.code, activity: activity.name });
    }
  }
  createQueryParksActivities(parkActivities);
}

function createQueryParksActivities(activities) {
  console.log("Creating query for Parks Activities");
  let query = `
    INSERT INTO parks_activities
    (park_code, activity)
    VALUES`;

  let i = 1;
  for (let j = 0; j < activities.length; j++) {
    if (j === activities.length - 1) {
      query += `($${i}, $${i + 1})`;
    } else {
      query += `($${i}, $${i + 1}),`;
    }

    i += 2;
  }

  let values = [];
  for (let park of activities) {
    for (let value of Object.values(park)) {
      values.push(value);
    }
  }
  insertParksActivities(query, values);
}
async function insertParksActivities(query, values) {
  db.query(query, values).then(() => process.exit());
  console.log("All Parks Activities are inserted");
}

getParks(url);
