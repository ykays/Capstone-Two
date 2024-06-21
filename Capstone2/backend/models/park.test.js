process.env.NODE_ENV = "test"; // it has to be first
const request = require("supertest");
const app = require("../app");
const db = require("../db");
const User = require("./user");
const Route = require("./route");
const Park = require("./park");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ExpressError,
} = require("../expressError");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

///////// GET PARKS for NO USER
describe("get all parks for no user", function () {
  test("get parks with no filters", async function () {
    const filters = {};
    const res = await Park.getAllParks();
    expect(res).toEqual([
      {
        code: "code1",
        name: "Park Name One",
        longitude: "-85.67330523",
        latitude: "37.5858662",
        parkType: "National Park",
        state: "MA",
      },
      {
        code: "code2",
        name: "Park Name Two",
        longitude: "-85.67330523",
        latitude: "37.5858662",
        parkType: "National Reserve",
        state: "NH",
      },
      {
        code: "code3",
        name: "Park Name Three",
        longitude: "-85.67330523",
        latitude: "37.5858662",
        parkType: "National Park",
        state: "NH",
      },
    ]);
  });
  test("get parks with state filter", async function () {
    const filters = { state: "MA" };
    const res = await Park.getAllParks(filters);
    expect(res).toEqual([
      {
        code: "code1",
        name: "Park Name One",
        longitude: "-85.67330523",
        latitude: "37.5858662",
        parkType: "National Park",
        state: "MA",
      },
    ]);
  });
  test("get parks with type filter", async function () {
    const filters = { park_type: "National Park" };
    const res = await Park.getAllParks(filters);
    expect(res).toEqual([
      {
        code: "code1",
        name: "Park Name One",
        longitude: "-85.67330523",
        latitude: "37.5858662",
        parkType: "National Park",
        state: "MA",
      },
      {
        code: "code3",
        name: "Park Name Three",
        longitude: "-85.67330523",
        latitude: "37.5858662",
        parkType: "National Park",
        state: "NH",
      },
    ]);
  });
  test("get parks with activity filter", async function () {
    const filters = { activity: ["Hiking", "Biking"] };
    const res = await Park.getAllParks(filters);
    expect(res).toEqual([
      {
        code: "code1",
        name: "Park Name One",
        longitude: "-85.67330523",
        latitude: "37.5858662",
        parkType: "National Park",
        state: "MA",
      },

      {
        code: "code2",
        name: "Park Name Two",
        longitude: "-85.67330523",
        latitude: "37.5858662",
        parkType: "National Reserve",
        state: "NH",
      },
    ]);
  });
  test("get parks with all filters", async function () {
    const filters = {
      state: "MA",
      park_type: "National Park",
      activity: ["Hiking", "Biking"],
    };
    const res = await Park.getAllParks(filters);
    expect(res).toEqual([
      {
        code: "code1",
        name: "Park Name One",
        longitude: "-85.67330523",
        latitude: "37.5858662",
        parkType: "National Park",
        state: "MA",
      },
    ]);
  });
});

//// GETS PARKS FOR USER
describe("get all parks with user info", function () {
  test("get parks with no filters", async function () {
    const res = await Park.getAllParksForUser("u1");

    expect(res).toEqual([
      {
        code: "code1",
        name: "Park Name One",
        longitude: "-85.67330523",
        latitude: "37.5858662",
        parkType: "National Park",
        state: "MA",
        visited: true,
      },
      {
        code: "code2",
        name: "Park Name Two",
        longitude: "-85.67330523",
        latitude: "37.5858662",
        parkType: "National Reserve",
        state: "NH",
        visited: false,
      },
      {
        code: "code3",
        name: "Park Name Three",
        longitude: "-85.67330523",
        latitude: "37.5858662",
        parkType: "National Park",
        state: "NH",
        visited: true,
      },
    ]);
  });
  test("get parks with state filter", async function () {
    const filters = { state: "MA" };
    const res = await Park.getAllParksForUser("u1", filters);
    expect(res).toEqual([
      {
        code: "code1",
        name: "Park Name One",
        longitude: "-85.67330523",
        latitude: "37.5858662",
        parkType: "National Park",
        state: "MA",
        visited: true,
      },
    ]);
  });
  test("get parks with type filter", async function () {
    const filters = { park_type: "National Park" };
    const res = await Park.getAllParksForUser("u1", filters);
    expect(res).toEqual([
      {
        code: "code1",
        name: "Park Name One",
        longitude: "-85.67330523",
        latitude: "37.5858662",
        parkType: "National Park",
        state: "MA",
        visited: true,
      },
      {
        code: "code3",
        name: "Park Name Three",
        longitude: "-85.67330523",
        latitude: "37.5858662",
        parkType: "National Park",
        state: "NH",
        visited: true,
      },
    ]);
  });
  test("get parks with activity filter", async function () {
    const filters = { activity: ["Hiking", "Biking"] };
    const res = await Park.getAllParksForUser("u1", filters);
    expect(res).toEqual([
      {
        code: "code1",
        name: "Park Name One",
        longitude: "-85.67330523",
        latitude: "37.5858662",
        parkType: "National Park",
        state: "MA",
        visited: true,
      },

      {
        code: "code2",
        name: "Park Name Two",
        longitude: "-85.67330523",
        latitude: "37.5858662",
        parkType: "National Reserve",
        state: "NH",
        visited: false,
      },
    ]);
  });
  test("get parks with all filters", async function () {
    const filters = {
      state: "MA",
      park_type: "National Park",
      activity: ["Hiking", "Biking"],
    };
    const res = await Park.getAllParksForUser("u1", filters);
    expect(res).toEqual([
      {
        code: "code1",
        name: "Park Name One",
        longitude: "-85.67330523",
        latitude: "37.5858662",
        parkType: "National Park",
        state: "MA",
        visited: true,
      },
    ]);
  });
});
