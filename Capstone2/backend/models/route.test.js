process.env.NODE_ENV = "test"; // it has to be first
const request = require("supertest");
const app = require("../app");
const db = require("../db");
const User = require("./user");
const Route = require("./route");
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

//////// ADD NEW ROUTE
describe("Create a new route", function () {
  test("correct details", async function () {
    const newRoute = {
      username: "u1",
      routeName: "fall route",
      routeNotes: "maybe fall 2025",
      routeDetails: [
        {
          waypointName: "Point1",
          waypointLongitude: 42.531,
          waypointLatitude: -71.6,
          waypointNotes: "test city",
        },
        {
          waypointName: "Point2",
          waypointLongitude: 42.531,
          waypointLatitude: -71.6,
        },
      ],
    };
    const res = await Route.addNewRoute(
      newRoute.username,
      newRoute.routeName,
      newRoute.routeNotes,
      newRoute.routeDetails
    );
    expect(res.routeName).toEqual("fall route");
    expect(res.routeNotes).toEqual("maybe fall 2025");
    expect(res.username).toEqual("u1");
  });
  test("missing details", async function () {
    const newRoute = {
      username: "u1",
      //routeName: "fall route",
      routeNotes: "maybe fall 2025",
      routeDetails: [
        {
          waypointName: "Point1",
          waypointLongitude: 42.531,
          waypointLatitude: -71.6,
          waypointNotes: "test city",
        },
        {
          waypointName: "Point2",
          waypointLongitude: 42.531,
          waypointLatitude: -71.6,
        },
      ],
    };
    try {
      const res = await Route.addNewRoute(
        newRoute.username,
        newRoute.routeNotes,
        newRoute.routeDetails
      );
      fail();
    } catch (err) {
      console.log(err);
      expect(err instanceof TypeError).toBeTruthy();
    }
  });
  test("incorrect details", async function () {
    const newRoute = {
      username: "u1",
      routeName: "fall route",
      routeNotes: "maybe fall 2025",
      routeDetails: [
        {
          waypointName: "Point1",
          waypointLongitude: "42.531",
          waypointLatitude: "-71.6",
          waypointNotes: "test city",
        },
        {
          waypointName: "Point2",
          waypointLongitude: 42.531,
          waypointLatitude: -71.6,
        },
      ],
    };
    try {
      const res = await Route.addNewRoute(
        newRoute.username,
        newRoute.routeNotes,
        newRoute.routeDetails
      );
      fail();
    } catch (err) {
      console.log(err);
      expect(err instanceof TypeError).toBeTruthy();
    }
  });
});

////GET ROUTE DETAILS
describe("get route details", function () {
  test("route details exists and return correct", async function () {
    const newRoute = {
      username: "u1",
      routeName: "fall route",
      routeNotes: "maybe fall 2025",
      routeDetails: [
        {
          waypointName: "Point1",
          waypointLongitude: 42.531,
          waypointLatitude: -71.6,
          waypointNotes: "test city",
        },
        {
          waypointName: "Point2",
          waypointLongitude: 42.531,
          waypointLatitude: -71.6,
        },
      ],
    };

    const route = await Route.addNewRoute(
      newRoute.username,
      newRoute.routeName,
      newRoute.routeNotes,
      newRoute.routeDetails
    );

    const res = await Route.getRouteDetails(route.id);
    expect(res.routeName).toEqual("fall route");
    expect(res.routeNotes).toEqual("maybe fall 2025");
    expect(res.username).toEqual("u1");
    expect(res.details).toEqual([
      {
        seqNumber: 0,
        waypointName: "Point1",
        waypointLongitude: "42.531",
        waypointLatitude: "-71.6",
        waypointNotes: "test city",
      },
      {
        seqNumber: 1,
        waypointName: "Point2",
        waypointLongitude: "42.531",
        waypointLatitude: "-71.6",
        waypointNotes: "",
      },
    ]);
  });
  test("route does not exist", async function () {
    try {
      await Route.getRouteDetails("0");
      fail();
    } catch (err) {
      console.log(err);
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

////DELETE ROUTE
describe("delete route", function () {
  test("route is deleted", async function () {
    const newRoute = {
      username: "u1",
      routeName: "fall route",
      routeNotes: "maybe fall 2025",
      routeDetails: [
        {
          waypointName: "Point1",
          waypointLongitude: 42.531,
          waypointLatitude: -71.6,
          waypointNotes: "test city",
        },
        {
          waypointName: "Point2",
          waypointLongitude: 42.531,
          waypointLatitude: -71.6,
        },
      ],
    };

    const route = await Route.addNewRoute(
      newRoute.username,
      newRoute.routeName,
      newRoute.routeNotes,
      newRoute.routeDetails
    );

    const res = await Route.deleteRoute(route.id);
    expect(res).toEqual({ id: route.id });
  });
  test("route is not found", async function () {
    try {
      const res = await Route.deleteRoute("0");
      fail();
    } catch (err) {
      console.log(err);
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
