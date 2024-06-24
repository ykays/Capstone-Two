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

/////////////// REGISTER
describe("POST /users/register", function () {
  test("works with correct details", async function () {
    const resp = await request(app).post("/users/register").send({
      username: "newUsername",
      firstName: "firstName",
      lastName: "lastName",
      password: "password",
      email: "newTest@email.com",
    });
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      token: expect.any(String),
    });
  });
  test("bad request with missing fields", async function () {
    const resp = await request(app).post("/users/register").send({
      username: "new",
    });
    expect(resp.statusCode).toEqual(400);
  });
  test("bad request with invalid data", async function () {
    const resp = await request(app).post("/users/register").send({
      username: "new",
      firstName: "first",
      lastName: "last",
      password: "password",
      email: "not-an-email",
    });
    expect(resp.statusCode).toEqual(400);
  });
});

/////////////// LOGIN

describe("POST users/login", function () {
  test("works with correct details", async function () {
    const resp = await request(app).post("/users/login").send({
      username: "u1",
      password: "password1",
    });
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      token: expect.any(String),
    });
  });
  test("incorrect password", async function () {
    const resp = await request(app).post("/users/login").send({
      username: "u1",
      password: "pass",
    });
    expect(resp.statusCode).toEqual(401);
  });
  test("incorrect username", async function () {
    const resp = await request(app).post("/users/login").send({
      username: "user90",
      password: "password1",
    });
    expect(resp.statusCode).toEqual(401);
  });
  test("no password", async function () {
    const resp = await request(app).post("/users/login").send({
      username: "u1",
    });
    expect(resp.statusCode).toEqual(400);
  });
});

//// VISITED

describe("POST users/visited", function () {
  test("new park, mark visited as true", async function () {
    const resp = await request(app)
      .post("/users/visited")
      .send({
        username: "u1",
        parkCode: "code2",
        visited: true,
      })
      .set("authorization", `Bearer ${u1Token}`);

    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      username: "u1",
      park_code: "code2",
      visited: true,
    });
  });
  test("existing park, mark visited as false", async function () {
    const resp = await request(app)
      .post("/users/visited")
      .send({
        username: "u1",
        parkCode: "code1",
        visited: false,
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      username: "u1",
      park_code: "code1",
      visited: false,
    });
  });
});

///// SAVE PARK NOTE
describe("POST /users/notes", function () {
  test("record does not exist, insert with notes", async function () {
    const resp = await request(app)
      .post("/users/notes")
      .send({
        username: "u2",
        parkCode: "code2",
        note: "u2 wants to visit this park",
      })
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      username: "u2",
      park_code: "code2",
      park_notes: "u2 wants to visit this park",
    });
  });
  test("record exists, update with new notes", async function () {
    const resp = await request(app)
      .post("/users/notes")
      .send({
        username: "u1",
        parkCode: "code1",
        note: "u1 wants to visit this park",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      username: "u1",
      park_code: "code1",
      park_notes: "u1 wants to visit this park",
    });
  });
});
