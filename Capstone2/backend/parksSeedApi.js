const axios = require("axios");
const process = require("process");
const { PORT } = require("./config");
const Park = require("./models/park");

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

const BASE_URL = PORT || "http://localhost:3001";

const url = `https://developer.nps.gov/api/v1/parks?limit=1000&api_key=${APIKey}`;

async function getParks() {
  try {
    const results = await axios.get(url);
    processResults(results.data.data);
  } catch (e) {
    console.log(`Error fetching ${url}`, e);
    process.exit(1);
  }
}

async function processResults(data) {
  data.forEach(async (park) => {
    await insertParkData(
      park.parkCode,
      park.fullName,
      Number(park.longitude),
      Number(park.latitude),
      park.designation,
      park.states
    );
    insertParkActivity(park.parkCode, park.activities);
  });
}

async function insertParkData(code, name, longitude, latitude, type, state) {
  const data = {
    code,
    name,
    longitude,
    latitude,
    type,
    state,
  };
  //await Park.createPark(data);

  await axios.post(`http://localhost:3001/parks/api/post`, data);
}

function insertParkActivity(code, activities) {
  activities.forEach(
    async (activity) =>
      await axios.post(`http://localhost:3001/parks/api/activity/post`, {
        code: code,
        activity: activity.name,
      })
  );
}
getParks(url);
