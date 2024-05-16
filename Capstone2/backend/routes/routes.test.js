"use strict";

const request = require("supertest");

const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/////////////// ADD NEW PARK ROUTE
describe("POST /routes/new", function () {
  test("works", async function () {
    const resp = await request(app)
      .post("/routes/new")
      .send({
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
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(201);
    expect(resp.body.route.username).toEqual("u1");
    expect(resp.body.route.routeName).toEqual("fall route");
  });
  test("unauthorized", async function () {
    const resp = await request(app)
      .post("/routes/new")
      .send({
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
      });

    expect(resp.statusCode).toBe(401);
  });
  test("missing details", async function () {
    const resp = await request(app)
      .post("/routes/new")
      .send({
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
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(400);
  });
  test("incorrect details", async function () {
    const resp = await request(app)
      .post("/routes/new")
      .send({
        username: "u1",
        routeName: 123,
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
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(400);
  });
  test("incorrect details in route details", async function () {
    const resp = await request(app)
      .post("/routes/new")
      .send({
        username: "u1",
        routeName: "123",
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
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(400);
  });
});
//////GET user's routes
describe("GET /routes/:username", function () {
  test("gets all routes for username", async function () {
    const route1 = await request(app)
      .post("/routes/new")
      .send({
        username: "u1",
        routeName: "route1",
        routeNotes: "maybe summer 2025",
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
      })
      .set("authorization", `Bearer ${u1Token}`);

    const route2 = await request(app)
      .post("/routes/new")
      .send({
        username: "u1",
        routeName: "route2",
        routeNotes: "maybe fall 2025",
        routeDetails: [
          {
            waypointName: "Point1",
            waypointLongitude: 42.531,
            waypointLatitude: -71.6,
            waypointNotes: "test city2",
          },
          {
            waypointName: "Point2",
            waypointLongitude: 42.531,
            waypointLatitude: -71.6,
          },
        ],
      })
      .set("authorization", `Bearer ${u1Token}`);

    const resp = await request(app)
      .get("/routes/u1")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      routes: [
        {
          id: route1.body.route.id,
          username: "u1",
          routeName: "route1",
          routeNotes: "maybe summer 2025",
          createTimestamp: expect.any(String),
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
        },
        {
          id: route2.body.route.id,
          username: "u1",
          routeName: "route2",
          routeNotes: "maybe fall 2025",
          createTimestamp: expect.any(String),
          details: [
            {
              seqNumber: 0,
              waypointName: "Point1",
              waypointLongitude: "42.531",
              waypointLatitude: "-71.6",
              waypointNotes: "test city2",
            },
            {
              seqNumber: 1,
              waypointName: "Point2",
              waypointLongitude: "42.531",
              waypointLatitude: "-71.6",
              waypointNotes: "",
            },
          ],
        },
      ],
    });
  });
  test("no routes for username", async function () {
    const resp = await request(app)
      .get("/routes/u2")
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toBe(404);
  });
  test("unauthorized", async function () {
    const resp = await request(app)
      .get("/routes/u2")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(401);
  });
});

/////Get single route's details
describe("GET /routes/:username/:id", function () {
  test("get details of a single route", async function () {
    const route1 = await request(app)
      .post("/routes/new")
      .send({
        username: "u1",
        routeName: "route1",
        routeNotes: "maybe summer 2025",

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
      })
      .set("authorization", `Bearer ${u1Token}`);

    const res = await request(app)
      .get(`/routes/u1/${route1.body.route.id}`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      route: {
        username: "u1",
        id: route1.body.route.id,
        routeName: "route1",
        routeNotes: "maybe summer 2025",
        createTimestamp: expect.any(String),
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
      },
    });
  });
  test("route not found", async function () {
    const res = await request(app)
      .get("/routes/u1/0")
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toBe(404);
  });
  test("unauthorized", async function () {
    const res = await request(app)
      .get("/routes/u1/0")
      .set("authorization", `Bearer ${u2Token}`);
    expect(res.statusCode).toBe(401);
  });
});

//// DELETE ROUTE

describe("DELETE /routes/:username/:id", function () {
  test("delete route", async function () {
    const route1 = await request(app)
      .post("/routes/new")
      .send({
        username: "u1",
        routeName: "route1",
        routeNotes: "maybe summer 2025",
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
      })
      .set("authorization", `Bearer ${u1Token}`);
    const res = await request(app)
      .delete(`/routes/u1/${route1.body.route.id}`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ route: { id: route1.body.route.id } });
  });
  test("route not found", async function () {
    const res = await request(app)
      .delete("/routes/u1/0")
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toBe(404);
  });
  test("unauthorized", async function () {
    const res = await request(app)
      .delete("/routes/u1/0")
      .set("authorization", `Bearer ${u2Token}`);
    expect(res.statusCode).toBe(401);
  });
});

//// EDIT ROUTE
describe("PATCH /routes/:username/:id", function () {
  test("edit notes and waypoints", async function () {
    const route = await request(app)
      .post("/routes/new")
      .send({
        username: "u1",
        routeName: "route1",
        routeNotes: "maybe summer 2025",
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
      })
      .set("authorization", `Bearer ${u1Token}`);

    const res = await request(app)
      .patch(`/routes/u1/${route.body.route.id}`)
      .send({
        routeNotes: "summer 2025",
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
          },
        ],
      })
      .set("authorization", `Bearer ${u1Token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      route: {
        username: "u1",
        id: route.body.route.id,
        routeName: "route1",
        routeNotes: "summer 2025",
        createTimestamp: expect.any(String),
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
            waypointNotes: "",
          },
        ],
      },
    });
  });
  test("edit notes only", async function () {
    const route = await request(app)
      .post("/routes/new")
      .send({
        username: "u1",
        routeName: "route1",
        routeNotes: "maybe summer 2025",
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
      })
      .set("authorization", `Bearer ${u1Token}`);

    const res = await request(app)
      .patch(`/routes/u1/${route.body.route.id}`)
      .send({
        routeNotes: "summer 2025",
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
      })
      .set("authorization", `Bearer ${u1Token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      route: {
        username: "u1",
        id: route.body.route.id,
        routeName: "route1",
        routeNotes: "summer 2025",
        createTimestamp: expect.any(String),
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
      },
    });
  });
  test("edit username -> error", async function () {
    const route = await request(app)
      .post("/routes/new")
      .send({
        username: "u1",
        routeName: "route1",
        routeNotes: "maybe summer 2025",
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
      })
      .set("authorization", `Bearer ${u1Token}`);

    const res = await request(app)
      .patch(`/routes/u1/${route.body.route.id}`)
      .send({
        username: "u2",
        routeNotes: "summer 2025",
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
      })
      .set("authorization", `Bearer ${u1Token}`);

    expect(res.statusCode).toBe(400);
  });
  test("unauthorized", async function () {
    const route = await request(app)
      .post("/routes/new")
      .send({
        username: "u1",
        routeName: "route1",
        routeNotes: "maybe summer 2025",
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
      })
      .set("authorization", `Bearer ${u1Token}`);

    const res = await request(app)
      .patch(`/routes/u1/${route.body.route.id}`)
      .send({
        routeNotes: "summer 2025",
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
      })
      .set("authorization", `Bearer ${u2Token}`);

    expect(res.statusCode).toBe(401);
  });
});
