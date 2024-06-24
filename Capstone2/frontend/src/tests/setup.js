import { afterEach, beforeEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll } from "vitest";
import { setupServer } from "msw/node";
import { HttpResponse, graphql, http } from "msw";

beforeEach(() => setUpDB(), window.localStorage.clear());
// runs a clean after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

let fakeDB = {};

function setUpDB() {
  const parks = {
    parks: [
      {
        code: "acad",
        name: "Acadia National Park",
        longitude: "-68.247501",
        latitude: "44.409286",
        parkType: "National Park",
        state: "ME",
      },
    ],
  };

  const parksUser = {
    parks: [
      {
        code: "acad",
        name: "Acadia National Park",
        longitude: "-68.247501",
        latitude: "44.409286",
        parkType: "National Park",
        state: "ME",
        visited: false,
      },
    ],
  };

  const parksUserVisted = {
    parks: [
      {
        code: "acad",
        name: "Acadia National Park",
        longitude: "-68.247501",
        latitude: "44.409286",
        parkType: "National Park",
        state: "ME",
        visited: true,
      },
    ],
  };

  const parksUserNotes = { park_notes: "To visit in 2024" };

  const filters = {
    parkActivity: ["Hiking", "Biking"],
    parkType: ["National Park", "National Monument"],
    states: ["AZ", "ME"],
  };

  const parkDetails = {
    data: {
      0: {
        fullName: "Acadia National Park",
        description:
          "Acadia National Park protects the natural beauty of the highest rocky headlands along the Atlantic coastline of the United States, an abundance of habitats, and a rich cultural heritage.",
        images: ["#"],
      },
    },
  };

  const user = {
    user: {
      username: "testUser",
      email: "testUser@gmail.com",
      firstName: "Test",
      lastName: "User",
    },
  };

  const routesUser = {
    routes: [
      {
        id: 1,
        username: "testUser",
        routeName: "My Route 1",
        routeNotes: "Route 1 Notes",
        createTimestamp: "2024-06-18T18:06:20.982Z",
        details: [
          {
            seqNumber: 0,
            waypointName: "Portland",
            waypointLongitude: "-122.69578185930418",
            waypointLatitude: "45.30580259943578",
            parkFlag: false,
            parkCode: null,
          },
          {
            seqNumber: 1,
            waypointName: "Whitman Mission National Historic Site",
            waypointLongitude: "-118.4629388",
            waypointLatitude: "46.04119286",
            parkFlag: true,
            parkCode: "whmi",
          },
          {
            seqNumber: 2,
            waypointName: "John Day Fossil Beds National Monument",
            waypointLongitude: "-119.8811491",
            waypointLatitude: "44.62566508",
            parkFlag: true,
            parkCode: "joda",
          },
        ],
      },
      {
        id: 2,
        username: "testUser",
        routeName: "My Route 2",
        routeNotes: "Route 2 Notes",
        createTimestamp: "2024-06-21T17:59:21.626Z",
        details: [
          {
            seqNumber: 0,
            waypointName: "Ice Age National Scenic Trail",
            waypointLongitude: "-89.5612021706",
            waypointLatitude: "43.9895697794",
            parkFlag: true,
            parkCode: "iatr",
          },
          {
            seqNumber: 1,
            waypointName: "Herbert Hoover National Historic Site",
            waypointLongitude: "-91.35232139",
            waypointLatitude: "41.66793558",
            parkFlag: true,
            parkCode: "heho",
          },
        ],
      },
    ],
  };

  fakeDB = {
    parks,
    parksUser,
    parksUserVisted,
    parksUserNotes,
    filters,
    parkDetails,
    user,
    routesUser,
  };
}

export const restHandlers = [
  http.get("http://localhost:3001/parks/", ({ request }) => {
    const url = new URL(request.url);
    const park = url.searchParams.get("state");
    if (park === "AZ") {
      return HttpResponse.json({ parks: [] });
    }
    return HttpResponse.json(fakeDB.parks);
  }),

  http.get("http://localhost:3001/parks/api/filters", () => {
    return HttpResponse.json(fakeDB.filters);
  }),

  http.get("http://localhost:3001/nps/acad", () => {
    return HttpResponse.json(fakeDB.parkDetails);
  }),

  http.get("http://localhost:3001/users/testUser", () => {
    return HttpResponse.json(fakeDB.user);
  }),

  http.get("http://localhost:3001/parks/testUser", () => {
    return HttpResponse.json(fakeDB.parksUser);
  }),

  http.post("http://localhost:3001/users/visited", () => {
    return HttpResponse.json(fakeDB.parksUserVisted);
  }),

  http.post("http://localhost:3001/users/notes", () => {
    return HttpResponse.json(fakeDB.parksUserNotes);
  }),

  http.get("http://localhost:3001/users/notes/testUser/acad", () => {
    return HttpResponse.json(fakeDB.parksUserNotes);
  }),

  http.post("http://localhost:3001/routes/new", () => {
    fakeDB.routesUser.routes.push({
      id: 3,
      username: "testUser",
      routeName: "My Test Route",
      routeNotes: "My Notes",
      createTimestamp: "2024-06-18T18:06:20.982Z",
      details: [
        {
          seqNumber: 0,
          waypointName: "Acadia National Park",
          waypointLongitude: "-68.247501",
          waypointLatitude: "44.409286",
          parkFlag: true,
          parkCode: "acad",
        },
        {
          seqNumber: 1,
          waypointName: "Adams National Historical Park",
          waypointLongitude: "-71.01160356",
          waypointLatitude: "42.2553961",
          parkFlag: true,
          parkCode: "adam",
        },
      ],
    });
    return HttpResponse.json({ msg: "Route saved", status: "success" });
  }),

  http.get("http://localhost:3001/routes/testUser", () => {
    return HttpResponse.json(fakeDB.routesUser);
  }),

  http.delete("http://localhost:3001/routes/testUser/2", () => {
    fakeDB.routesUser.routes.pop();
    return HttpResponse.json(fakeDB.routesUser);
  }),

  http.patch("http://localhost:3001/routes/testUser/2", () => {
    fakeDB.routesUser.routes[1].details.push({
      seqNumber: 2,
      waypointName: "Acadia National Park",
      waypointLongitude: "-68.247501",
      waypointLatitude: "44.409286",
      parkFlag: true,
      parkCode: "acad",
    });
    return HttpResponse.json(fakeDB.routesUser);
  }),
  http.post("http://localhost:3001/users/login", async ({ request }) => {
    const data = await request.json();
    const username = data["username"];
    const password = data["password"];
    if (username !== "testUser" || password !== "testUserPassword123") {
      return new HttpResponse(null, {
        status: 401,
        data: {
          error: { message: "Invalid username/password" },
        },
      });
    }

    return HttpResponse.json({
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RVc2VyIiwiaWF0IjoxNzE5MjQ2ODE2fQ.oqf_-bWzV8pvxb1aFYgVs2eqvV3l98BYzr-2trSXjBU",
    });
  }),
  http.post("http://localhost:3001/users/register", async ({ request }) => {
    const data = await request.json();
    const username = data["username"];
    if (username === "testUser2")
      return HttpResponse.json({
        error: {
          message: "Duplicate username: testUser2",
          status: 400,
        },
      });

    return HttpResponse.json({
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RVc2VyIiwiaWF0IjoxNzE5MjQ2ODE2fQ.oqf_-bWzV8pvxb1aFYgVs2eqvV3l98BYzr-2trSXjBU",
    });
  }),
];

const server = setupServer(...restHandlers);

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));

//  Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers());
