import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll } from "vitest";
import { setupServer } from "msw/node";
import { HttpResponse, graphql, http } from "msw";

// runs a clean after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});
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

const routesUserAfterDelete = {
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
  ],
};

export const restHandlers = [
  http.get("http://localhost:3001/parks/", ({ request }) => {
    const url = new URL(request.url);
    const park = url.searchParams.get("state");
    if (park === "AZ") {
      return HttpResponse.json({ parks: [] });
    }
    return HttpResponse.json(parks);
  }),

  http.get("http://localhost:3001/parks/api/filters", () => {
    return HttpResponse.json(filters);
  }),

  http.get(
    "https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=6L5DF3fir451g48EkdjM9GvRnPgeoIEBYGi4DLxa",
    () => {
      return HttpResponse.json(parkDetails);
    }
  ),

  http.get("http://localhost:3001/users/testUser", () => {
    return HttpResponse.json(user);
  }),

  http.get("http://localhost:3001/parks/testUser", () => {
    return HttpResponse.json(parksUser);
  }),

  http.post("http://localhost:3001/users/visited", () => {
    return HttpResponse.json(parksUserVisted);
  }),

  http.post("http://localhost:3001/users/notes", () => {
    return HttpResponse.json(parksUserNotes);
  }),

  http.get("http://localhost:3001/users/notes/testUser/acad", () => {
    return HttpResponse.json(parksUserNotes);
  }),

  http.post("http://localhost:3001/routes/new", () => {
    return HttpResponse.json({ msg: "Route saved", status: "success" });
  }),

  http.get("http://localhost:3001/routes/testUser", () => {
    return HttpResponse.json(routesUser);
  }),

  http.delete("http://localhost:3001/routes/testUser/2", () => {
    return HttpResponse.json(routesUserAfterDelete);
  }),
];

const server = setupServer(...restHandlers);

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));

//  Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers());
