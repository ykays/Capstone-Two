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

////////////GET ALL PARKS NO USER
describe("GET /parks", function () {
  test("get all park with no filters", async function () {
    const resp = await request(app).get("/parks");
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      parks: [
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
        {
          code: "code4",
          name: "Park Name Four",
          longitude: "-85.67330523",
          latitude: "37.5858662",
          parkType: "National Park",
          state: "MA",
        },
        {
          code: "code5",
          name: "Park Name Five",
          longitude: "-85.67330523",
          latitude: "37.5858662",
          parkType: "National Reserve",
          state: "MA",
        },
        {
          code: "code6",
          name: "Park Name Six",
          longitude: "-85.67330523",
          latitude: "37.5858662",
          parkType: "National Park",
          state: "NH",
        },
        {
          code: "code7",
          name: "Park Name Seven",
          longitude: "-85.67330523",
          latitude: "37.5858662",
          parkType: "National Park",
          state: "MA",
        },
      ],
    });
  });
  test("get parks with state filter", async function () {
    const resp = await request(app).get("/parks?state=MA");
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      parks: [
        {
          code: "code1",
          name: "Park Name One",
          longitude: "-85.67330523",
          latitude: "37.5858662",
          parkType: "National Park",
          state: "MA",
        },
        {
          code: "code4",
          name: "Park Name Four",
          longitude: "-85.67330523",
          latitude: "37.5858662",
          parkType: "National Park",
          state: "MA",
        },
        {
          code: "code5",
          name: "Park Name Five",
          longitude: "-85.67330523",
          latitude: "37.5858662",
          parkType: "National Reserve",
          state: "MA",
        },
        {
          code: "code7",
          name: "Park Name Seven",
          longitude: "-85.67330523",
          latitude: "37.5858662",
          parkType: "National Park",
          state: "MA",
        },
      ],
    });
  });
  test("get parks with type filter", async function () {
    const resp = await request(app).get("/parks?park_type=National Park");
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      parks: [
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
        {
          code: "code4",
          name: "Park Name Four",
          longitude: "-85.67330523",
          latitude: "37.5858662",
          parkType: "National Park",
          state: "MA",
        },
        {
          code: "code6",
          name: "Park Name Six",
          longitude: "-85.67330523",
          latitude: "37.5858662",
          parkType: "National Park",
          state: "NH",
        },
        {
          code: "code7",
          name: "Park Name Seven",
          longitude: "-85.67330523",
          latitude: "37.5858662",
          parkType: "National Park",
          state: "MA",
        },
      ],
    });
  });

  test("get parks with activity filter", async function () {
    const resp = await request(app).get(
      "/parks?activity=Hiking&activity=Biking"
    );
    expect(resp.body).toEqual({
      parks: [
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
        {
          code: "code6",
          name: "Park Name Six",
          longitude: "-85.67330523",
          latitude: "37.5858662",
          parkType: "National Park",
          state: "NH",
        },
      ],
    });
  });
  test("get parks with all filters", async function () {
    const resp = await request(app).get(
      "/parks?state=MA&park_type=National Park&activity=Hiking&activity=Biking"
    );
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      parks: [
        {
          code: "code1",
          name: "Park Name One",
          longitude: "-85.67330523",
          latitude: "37.5858662",
          parkType: "National Park",
          state: "MA",
        },
      ],
    });
  });
});

///////// GETS PARKS FOR USER
describe("GET /parks/:username", function () {
  test("get parks with no filters", async function () {
    const res = await request(app)
      .get("/parks/u1")
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      parks: [
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
        {
          code: "code4",
          name: "Park Name Four",
          longitude: "-85.67330523",
          latitude: "37.5858662",
          parkType: "National Park",
          state: "MA",
          visited: false,
        },
        {
          code: "code5",
          name: "Park Name Five",
          longitude: "-85.67330523",
          latitude: "37.5858662",
          parkType: "National Reserve",
          state: "MA",
          visited: false,
        },
        {
          code: "code6",
          name: "Park Name Six",
          longitude: "-85.67330523",
          latitude: "37.5858662",
          parkType: "National Park",
          state: "NH",
          visited: false,
        },
        {
          code: "code7",
          name: "Park Name Seven",
          longitude: "-85.67330523",
          latitude: "37.5858662",
          parkType: "National Park",
          state: "MA",
          visited: false,
        },
      ],
    });
  });
  test("get parks with state filter", async function () {
    const filters = { state: "MA" };
    const res = await request(app)
      .get("/parks/u1?state=MA")
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      parks: [
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
          code: "code4",
          name: "Park Name Four",
          longitude: "-85.67330523",
          latitude: "37.5858662",
          parkType: "National Park",
          state: "MA",
          visited: false,
        },
        {
          code: "code5",
          name: "Park Name Five",
          longitude: "-85.67330523",
          latitude: "37.5858662",
          parkType: "National Reserve",
          state: "MA",
          visited: false,
        },
        {
          code: "code7",
          name: "Park Name Seven",
          longitude: "-85.67330523",
          latitude: "37.5858662",
          parkType: "National Park",
          state: "MA",
          visited: false,
        },
      ],
    });
  });
  test("get parks with type filter", async function () {
    const res = await request(app)
      .get("/parks/u1?park_type=National Park")
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      parks: [
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
        {
          code: "code4",
          name: "Park Name Four",
          longitude: "-85.67330523",
          latitude: "37.5858662",
          parkType: "National Park",
          state: "MA",
          visited: false,
        },
        {
          code: "code6",
          name: "Park Name Six",
          longitude: "-85.67330523",
          latitude: "37.5858662",
          parkType: "National Park",
          state: "NH",
          visited: false,
        },
        {
          code: "code7",
          name: "Park Name Seven",
          longitude: "-85.67330523",
          latitude: "37.5858662",
          parkType: "National Park",
          state: "MA",
          visited: false,
        },
      ],
    });
  });
  test("get parks with activity filter", async function () {
    const res = await request(app)
      .get("/parks/u1?activity=Hiking&activity=Biking")
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      parks: [
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
        {
          code: "code6",
          name: "Park Name Six",
          longitude: "-85.67330523",
          latitude: "37.5858662",
          parkType: "National Park",
          state: "NH",
          visited: false,
        },
      ],
    });
  });
  test("get parks with all filters", async function () {
    const res = await request(app)
      .get(
        "/parks/u1?state=MA&park_type=National Park&activity=Hiking&activity=Biking"
      )
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      parks: [
        {
          code: "code1",
          name: "Park Name One",
          longitude: "-85.67330523",
          latitude: "37.5858662",
          parkType: "National Park",
          state: "MA",
          visited: true,
        },
      ],
    });
  });
  test("unauthorized", async function () {
    const res = await request(app).get(
      "/parks/u1?state=MA&park_type=National Park&activity=Hiking&activity=Biking"
    );
    expect(res.statusCode).toBe(401);
  });
});
