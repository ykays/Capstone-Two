process.env.NODE_ENV = "test"; // it has to be first
const request = require("supertest");
const app = require("../app");
const db = require("../db");
const User = require("./user");
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
} = require("../expressError");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/////////////////////////////////
describe("register new user", function () {
  const newUser = {
    username: "newTest",
    password: "testUserPassword",
    firstName: "TestFirstName",
    lastName: "TestLastName",
    email: "testemail@test.com",
    isAdmin: false,
  };

  test("correct user details", async function () {
    const user = await User.register(newUser);
    expect(user.username).toEqual(newUser.username);
    expect(user.email).toEqual(newUser.email);
    expect(user.firstName).toEqual(newUser.firstName);
    expect(user.lastName).toEqual(newUser.lastName);
    expect(user.isAdmin).toEqual(newUser.isAdmin);
  });

  test("correct admin details", async function () {
    const newAdmin = {
      username: "newAdmin",
      password: "testAdminPassword",
      firstName: "AdminFirstName",
      lastName: "AdminLastName",
      email: "adminemail@test.com",
      isAdmin: true,
    };
    const user = await User.register(newAdmin);
    expect(user.username).toEqual(newAdmin.username);
    expect(user.email).toEqual(newAdmin.email);
    expect(user.firstName).toEqual(newAdmin.firstName);
    expect(user.lastName).toEqual(newAdmin.lastName);
    expect(user.isAdmin).toEqual(newAdmin.isAdmin);
  });
  test("duplicated user", async function () {
    try {
      await User.register(newUser);
      await User.register(newUser);
      fail();
    } catch (err) {
      console.log(err);
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/////////////////////////////////
describe("login", function () {
  test("correct details", async function () {
    const user = await User.login("u1", "password1");
    expect(user).toEqual({
      username: "u1",
      firstName: "U1F",
      lastName: "U1L",
      email: "u1@email.com",
      isAdmin: false,
    });
  });
  test("incorrect user password", async function () {
    try {
      await User.login("u1", "incorrectpassword");
      fail();
    } catch (err) {
      console.log(err);
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
  test("incorrect username", async function () {
    try {
      await User.login("notAUser", "password1");
      fail();
    } catch (err) {
      console.log(err);
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});

////////// VISITED
describe("mark park visited", function () {
  test("no record-> insert, mark visited as true", async function () {
    const results = await User.markVisited("u1", "code2", true);
    expect(results).toEqual({
      username: "u1",
      park_code: "code2",
      visited: true,
    });
  });
  test("record exist-> update, mark visited as false", async function () {
    const results = await User.markVisited("u1", "code1", false);
    expect(results).toEqual({
      username: "u1",
      park_code: "code1",
      visited: false,
    });
  });
});

///// Save Notes
describe("save park notes", function () {
  test("no record -> insert with notes", async function () {
    const results = await User.saveNote("u2", "code2", "park note for u2");
    expect(results).toEqual({
      username: "u2",
      park_code: "code2",
      park_notes: "park note for u2",
    });
  });
  test("record exist -> update with notes", async function () {
    const results = await User.saveNote("u1", "code1", "park note for u1");
    expect(results).toEqual({
      username: "u1",
      park_code: "code1",
      park_notes: "park note for u1",
    });
  });
});
