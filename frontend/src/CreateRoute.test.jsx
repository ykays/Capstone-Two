import React, { act } from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  prettyDOM,
} from "@testing-library/react";
import App from "./App";
import CreateRoute from "./CreateRoute.jsx";
import { Provider } from "react-redux";
import root from "./reducers/root.jsx";
import { configureStore } from "@reduxjs/toolkit";

describe("CreateRoute smoke tests", () => {
  const store = configureStore({ reducer: root });
  it("renders the App component without crashing", () => {
    render(
      <Provider store={store}>
        <CreateRoute />
      </Provider>
    );
  });
  it("matches snapshot", function () {
    const { asFragment } = render(
      <Provider store={store}>
        <CreateRoute />
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

test("clicking on Create Route", async () => {
  const store = configureStore({ reducer: root });
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  await act(async () => await new Promise(process.nextTick));

  fireEvent.click(screen.getByText(/Create Route/i));
  expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Route Notes/i)).toBeInTheDocument();
  expect(screen.getByText(/To add a Waypoint/i)).toBeInTheDocument();
  expect(screen.getByTestId("AddLocationIcon")).toBeInTheDocument();
});

test("park marker should have Add to route button", async () => {
  const store = configureStore({ reducer: root });
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  await act(async () => await new Promise(process.nextTick));

  fireEvent.click(screen.getByText(/Create Route/i));
  fireEvent.click(screen.getByRole("button", { name: "acad" }));
  expect(screen.getByText("Add to Route")).toBeInTheDocument();
});

test("park added to route", async () => {
  const store = configureStore({ reducer: root });
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  await act(async () => await new Promise(process.nextTick));

  fireEvent.click(screen.getByText(/Create Route/i));
  fireEvent.click(screen.getByRole("button", { name: "acad" }));
  fireEvent.click(screen.getByRole("button", { name: "Add to Route" }));
  expect(screen.getByLabelText("Waypoint")).toHaveAttribute("disabled");
  expect(screen.getByLabelText("Waypoint")).toHaveValue("Acadia National Park");
});

test("creating a route user logged in", async () => {
  const user = {
    username: "testUser",
    email: "testUser@gmail.com",
    firstName: "Test",
    lastName: "User",
  };
  const parks = [
    {
      code: "acad",
      name: "Acadia National Park",
      longitude: "-68.247501",
      latitude: "44.409286",
      parkType: "National Park",
      state: "ME",
    },
    {
      code: "adam",
      name: "Adams National Historical Park",
      longitude: "-71.01160356",
      latitude: "42.2553961",
      parkType: "National Historical Park",
      state: "MA",
    },
  ];

  const store = configureStore({ reducer: root });
  store.dispatch({ type: "FETCH_USER", user: user });
  store.dispatch({ type: "FETCH_PARKS", parks: parks });
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  await act(async () => await new Promise(process.nextTick));
  store.dispatch({ type: "FETCH_PARKS", parks: parks });
  await act(async () => await new Promise(process.nextTick));

  act(() => {
    fireEvent.click(screen.getByText(/Create Route/i));
    fireEvent.click(screen.getByAltText("acad"));
  });
  act(() => {
    fireEvent.click(screen.getByText("Add to Route"));
  });

  act(() => {
    fireEvent.click(screen.getByRole("button", { name: "adam" }));
  });
  act(() => {
    fireEvent.click(screen.getByRole("button", { name: "Add to Route" }));
  });

  const listItems = screen.getAllByRole("listitem");
  expect(listItems).toHaveLength(2);
  expect(
    screen.getByRole("button", { name: "Save Route" })
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Save Route" })
  ).not.toHaveAttribute("disabled");
});

test("creating a route user not logged in", async () => {
  const parks = [
    {
      code: "acad",
      name: "Acadia National Park",
      longitude: "-68.247501",
      latitude: "44.409286",
      parkType: "National Park",
      state: "ME",
    },
    {
      code: "adam",
      name: "Adams National Historical Park",
      longitude: "-71.01160356",
      latitude: "42.2553961",
      parkType: "National Historical Park",
      state: "MA",
    },
  ];

  const store = configureStore({ reducer: root });
  store.dispatch({ type: "FETCH_PARKS", parks: parks });
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  await act(async () => await new Promise(process.nextTick));
  store.dispatch({ type: "FETCH_PARKS", parks: parks });
  await act(async () => await new Promise(process.nextTick));

  act(() => {
    fireEvent.click(screen.getByText(/Create Route/i));
    fireEvent.click(screen.getByAltText("acad"));
  });
  act(() => {
    fireEvent.click(screen.getByText("Add to Route"));
  });

  act(() => {
    fireEvent.click(screen.getByRole("button", { name: "adam" }));
  });
  act(() => {
    fireEvent.click(screen.getByRole("button", { name: "Add to Route" }));
  });

  const listItems = screen.getAllByRole("listitem");
  expect(listItems).toHaveLength(2);
  expect(
    screen.getByRole("button", { name: "Save Route" })
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Save Route" })).toHaveAttribute(
    "disabled"
  );
});

test("park added to the route shoudl have Remove From Route button", async () => {
  const store = configureStore({ reducer: root });
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  await act(async () => await new Promise(process.nextTick));

  fireEvent.click(screen.getByText(/Create Route/i));
  fireEvent.click(screen.getByRole("button", { name: "acad" }));
  fireEvent.click(screen.getByRole("button", { name: "Add to Route" }));
  expect(screen.getByLabelText("Waypoint")).toHaveAttribute("disabled");
  expect(screen.getByLabelText("Waypoint")).toHaveValue("Acadia National Park");
  const listItems = screen.getAllByRole("listitem");
  expect(listItems).toHaveLength(1);
  expect(
    screen.getByRole("button", { name: "Remove from Route" })
  ).toBeInTheDocument();
});

test("park removed from the list", async () => {
  const store = configureStore({ reducer: root });
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  await act(async () => await new Promise(process.nextTick));

  fireEvent.click(screen.getByText(/Create Route/i));
  fireEvent.click(screen.getByRole("button", { name: "acad" }));
  fireEvent.click(screen.getByRole("button", { name: "Add to Route" }));
  expect(screen.getByLabelText("Waypoint")).toHaveAttribute("disabled");
  expect(screen.getByLabelText("Waypoint")).toHaveValue("Acadia National Park");
  const listItems = screen.getAllByRole("listitem");
  expect(listItems).toHaveLength(1);
  expect(
    screen.getByRole("button", { name: "Remove from Route" })
  ).toBeInTheDocument();

  act(() => {
    fireEvent.click(screen.getByRole("button", { name: "Remove from Route" }));
  });
  expect(screen.queryAllByLabelText("Waypoint")).toHaveLength(0);
});

test("adding name and notes to the route", async () => {
  const parks = [
    {
      code: "acad",
      name: "Acadia National Park",
      longitude: "-68.247501",
      latitude: "44.409286",
      parkType: "National Park",
      state: "ME",
    },
    {
      code: "adam",
      name: "Adams National Historical Park",
      longitude: "-71.01160356",
      latitude: "42.2553961",
      parkType: "National Historical Park",
      state: "MA",
    },
  ];

  const store = configureStore({ reducer: root });
  store.dispatch({ type: "FETCH_PARKS", parks: parks });
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  await act(async () => await new Promise(process.nextTick));
  store.dispatch({ type: "FETCH_PARKS", parks: parks });
  await act(async () => await new Promise(process.nextTick));

  act(() => {
    fireEvent.click(screen.getByText(/Create Route/i));
    fireEvent.click(screen.getByAltText("acad"));
  });
  act(() => {
    fireEvent.click(screen.getByText("Add to Route"));
  });

  act(() => {
    fireEvent.click(screen.getByRole("button", { name: "adam" }));
  });
  act(() => {
    fireEvent.click(screen.getByRole("button", { name: "Add to Route" }));
  });

  const routeName = screen.getByLabelText(/Name/i);
  act(() => {
    fireEvent.click(routeName);
    fireEvent.change(routeName, { target: { value: "Route Name" } });
  });

  const routeNotes = screen.getByLabelText(/Route Notes/i);
  act(() => {
    fireEvent.click(routeNotes);
    fireEvent.change(routeNotes, { target: { value: "Route Notes" } });
  });

  const listItems = screen.getAllByRole("listitem");
  expect(listItems).toHaveLength(2);
  expect(
    screen.getByRole("button", { name: "Save Route" })
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Save Route" })).toHaveAttribute(
    "disabled"
  );
  expect(screen.getByLabelText(/Name/i)).toHaveValue("Route Name");
  expect(screen.getByLabelText(/Route Notes/i)).toHaveValue("Route Notes");
});

test("cancelling the route", async () => {
  const parks = [
    {
      code: "acad",
      name: "Acadia National Park",
      longitude: "-68.247501",
      latitude: "44.409286",
      parkType: "National Park",
      state: "ME",
    },
    {
      code: "adam",
      name: "Adams National Historical Park",
      longitude: "-71.01160356",
      latitude: "42.2553961",
      parkType: "National Historical Park",
      state: "MA",
    },
  ];

  const store = configureStore({ reducer: root });
  store.dispatch({ type: "FETCH_PARKS", parks: parks });
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  await act(async () => await new Promise(process.nextTick));
  store.dispatch({ type: "FETCH_PARKS", parks: parks });
  await act(async () => await new Promise(process.nextTick));

  act(() => {
    fireEvent.click(screen.getByText(/Create Route/i));
    fireEvent.click(screen.getByAltText("acad"));
  });
  act(() => {
    fireEvent.click(screen.getByText("Add to Route"));
  });

  act(() => {
    fireEvent.click(screen.getByRole("button", { name: "adam" }));
  });
  act(() => {
    fireEvent.click(screen.getByRole("button", { name: "Add to Route" }));
  });

  const routeName = screen.getByLabelText(/Name/i);
  act(() => {
    fireEvent.click(routeName);
    fireEvent.change(routeName, { target: { value: "Route Name" } });
  });

  const routeNotes = screen.getByLabelText(/Route Notes/i);
  act(() => {
    fireEvent.click(routeNotes);
    fireEvent.change(routeNotes, { target: { value: "Route Notes" } });
  });

  const listItems = screen.getAllByRole("listitem");

  act(() => {
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  });
  waitFor(() => {
    expect(screen.getByLabelText(/Name/i)).toHaveValue("");
    expect(screen.getByLabelText(/Route Notes/i)).toHaveValue("");
    expect(screen.queryAllByLabelText("Waypoint")).toHaveLength(0);
  });
});

test("saving a route", async () => {
  const user = {
    username: "testUser",
    email: "testUser@gmail.com",
    firstName: "Test",
    lastName: "User",
  };
  const parks = [
    {
      code: "acad",
      name: "Acadia National Park",
      longitude: "-68.247501",
      latitude: "44.409286",
      parkType: "National Park",
      state: "ME",
    },
    {
      code: "adam",
      name: "Adams National Historical Park",
      longitude: "-71.01160356",
      latitude: "42.2553961",
      parkType: "National Historical Park",
      state: "MA",
    },
  ];

  const store = configureStore({ reducer: root });
  store.dispatch({ type: "FETCH_USER", user: user });
  store.dispatch({ type: "FETCH_PARKS", parks: parks });
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  await act(async () => await new Promise(process.nextTick));
  store.dispatch({ type: "FETCH_PARKS", parks: parks });
  await act(async () => await new Promise(process.nextTick));

  act(() => {
    fireEvent.click(screen.getByText(/Create Route/i));
    fireEvent.click(screen.getByAltText("acad"));
  });
  act(() => {
    fireEvent.click(screen.getByText("Add to Route"));
  });

  act(() => {
    fireEvent.click(screen.getByRole("button", { name: "adam" }));
  });
  act(() => {
    fireEvent.click(screen.getByRole("button", { name: "Add to Route" }));
  });

  const routeName = screen.getByLabelText(/Name/i);
  act(() => {
    fireEvent.click(routeName);
    fireEvent.change(routeName, { target: { value: "My Test Route" } });
  });

  const routeNotes = screen.getByLabelText(/Route Notes/i);
  act(() => {
    fireEvent.click(routeNotes);
    fireEvent.change(routeNotes, { target: { value: "My Test Notes" } });
  });

  act(() => {
    fireEvent.click(screen.getByRole("button", { name: "Save Route" }));
  });
  await act(async () => await new Promise(process.nextTick));

  expect(screen.getByRole("alert")).toBeInTheDocument();
  expect(screen.getByRole("alert")).toHaveTextContent("Route saved");
  expect(screen.getByLabelText(/Name/i)).toHaveValue("");
  expect(screen.getByLabelText(/Route Notes/i)).toHaveValue("");
  expect(screen.queryAllByLabelText("Waypoint")).toHaveLength(0);
});

test("saved route appears in the My Routes list", async () => {
  const user = {
    username: "testUser",
    email: "testUser@gmail.com",
    firstName: "Test",
    lastName: "User",
  };
  const parks = [
    {
      code: "acad",
      name: "Acadia National Park",
      longitude: "-68.247501",
      latitude: "44.409286",
      parkType: "National Park",
      state: "ME",
    },
    {
      code: "adam",
      name: "Adams National Historical Park",
      longitude: "-71.01160356",
      latitude: "42.2553961",
      parkType: "National Historical Park",
      state: "MA",
    },
  ];

  const store = configureStore({ reducer: root });
  store.dispatch({ type: "FETCH_USER", user: user });
  store.dispatch({ type: "FETCH_PARKS", parks: parks });
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  await act(async () => await new Promise(process.nextTick));
  store.dispatch({ type: "FETCH_PARKS", parks: parks });
  await act(async () => await new Promise(process.nextTick));

  act(() => {
    fireEvent.click(screen.getByText(/Create Route/i));
    fireEvent.click(screen.getByAltText("acad"));
  });
  act(() => {
    fireEvent.click(screen.getByText("Add to Route"));
  });

  act(() => {
    fireEvent.click(screen.getByRole("button", { name: "adam" }));
  });
  act(() => {
    fireEvent.click(screen.getByRole("button", { name: "Add to Route" }));
  });

  const routeName = screen.getByLabelText(/Name/i);
  act(() => {
    fireEvent.click(routeName);
    fireEvent.change(routeName, { target: { value: "My Test Route" } });
  });

  const routeNotes = screen.getByLabelText(/Route Notes/i);
  act(() => {
    fireEvent.click(routeNotes);
    fireEvent.change(routeNotes, { target: { value: "My Test Notes" } });
  });

  act(() => {
    fireEvent.click(screen.getByRole("button", { name: "Save Route" }));
  });
  await act(async () => await new Promise(process.nextTick));

  expect(screen.getByRole("alert")).toBeInTheDocument();
  expect(screen.getByRole("alert")).toHaveTextContent("Route saved");
  expect(screen.getByLabelText(/Name/i)).toHaveValue("");
  expect(screen.getByLabelText(/Route Notes/i)).toHaveValue("");
  expect(screen.queryAllByLabelText("Waypoint")).toHaveLength(0);

  act(() => {
    fireEvent.click(screen.getByText(/My Routes/i));
  });
  await act(async () => await new Promise(process.nextTick));

  expect(screen.getByText("My Test Route")).toBeInTheDocument();
});
