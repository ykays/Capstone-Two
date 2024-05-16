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
/// GET ROUTES FOR USER
describe("get routes for user", function () {
  test("returns all routes for user with details", async function () {
    const newRoute1 = {
      username: "u1",
      routeName: "route1",
      routeNotes: "notes for route1",
      routeDetails: [
        {
          waypointName: "Point1",
          waypointLongitude: 42.531,
          waypointLatitude: -71.6,
          waypointNotes: "test city",
        },
      ],
    };
    const newRoute2 = {
      username: "u1",
      routeName: "route2",
      routeNotes: "notes for route2",
      routeDetails: [
        {
          waypointName: "Point1",
          waypointLongitude: 42.531,
          waypointLatitude: -71.6,
          waypointNotes: "test city",
        },
      ],
    };
    const route1 = await Route.addNewRoute(
      newRoute1.username,
      newRoute1.routeName,
      newRoute1.routeNotes,
      newRoute1.routeDetails
    );

    const route2 = await Route.addNewRoute(
      newRoute2.username,
      newRoute2.routeName,
      newRoute2.routeNotes,
      newRoute2.routeDetails
    );
    const res = await Route.getUserRoutes("u1");
    expect(res).toEqual([
      {
        id: route1.id,
        username: "u1",
        routeName: "route1",
        routeNotes: "notes for route1",
        createTimestamp: expect.any(Date),
        details: [
          {
            seqNumber: 0,
            waypointName: "Point1",
            waypointLongitude: "42.531",
            waypointLatitude: "-71.6",
            waypointNotes: "test city",
          },
        ],
      },
      {
        id: route2.id,
        username: "u1",
        routeName: "route2",
        routeNotes: "notes for route2",
        createTimestamp: expect.any(Date),
        details: [
          {
            seqNumber: 0,
            waypointName: "Point1",
            waypointLongitude: "42.531",
            waypointLatitude: "-71.6",
            waypointNotes: "test city",
          },
        ],
      },
    ]);
  });
  test("no routes found for the user", async function () {
    try {
      await Route.getUserRoutes("u2");
      fail();
    } catch (err) {
      console.log(err);
      expect(err instanceof NotFoundError).toBeTruthy();
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

//// EDIT ROUTE
describe("edit route", function () {
  test("edit notes and waypoints", async function () {
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

    const editData = {
      routeNotes: "vacation 2025",
      routeDetails: [
        {
          waypointName: "Point1Edited",
          waypointLongitude: 42.531,
          waypointLatitude: -71.6,
          waypointNotes: "test city",
        },
        {
          waypointName: "Point2Edited",
          waypointLongitude: 42.531,
          waypointLatitude: -71.6,
          waypointNotes: "new note",
        },
      ],
    };
    const res = await Route.editRoute(route.id, editData);
    expect(res).toEqual({
      id: route.id,
      username: "u1",
      routeName: "fall route",
      routeNotes: "vacation 2025",
      createTimestamp: expect.any(Date),
      details: [
        {
          seqNumber: 0,
          waypointName: "Point1Edited",
          waypointLongitude: "42.531",
          waypointLatitude: "-71.6",
          waypointNotes: "test city",
        },
        {
          seqNumber: 1,
          waypointName: "Point2Edited",
          waypointLongitude: "42.531",
          waypointLatitude: "-71.6",
          waypointNotes: "new note",
        },
      ],
    });
  });
  test("edit notes only", async function () {
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

    const editData = {
      routeNotes: "vacation 2025",
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
    const res = await Route.editRoute(route.id, editData);
    expect(res).toEqual({
      id: route.id,
      username: "u1",
      routeName: "fall route",
      routeNotes: "vacation 2025",
      createTimestamp: expect.any(Date),
      details: [
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
      ],
    });
  });
  test("route not found", async function () {
    try {
      const res = await Route.editRoute("0", "data");
      fail();
    } catch (err) {
      console.log(err);
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
