import React, { act } from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  prettyDOM,
  within,
} from "@testing-library/react";
import App from "./App";
import RoutesList from "./RoutesList.jsx";
import { Provider } from "react-redux";
import root from "./reducers/root.jsx";
import { configureStore } from "@reduxjs/toolkit";

test("My Routes button is not available - user not logged in", async () => {
  const store = configureStore({ reducer: root });
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  await act(async () => await new Promise(process.nextTick));
  expect(screen.queryByText("My Routes")).not.toBeInTheDocument();
  expect(screen.getByText("Create Route")).toBeInTheDocument();
});

test("My Routes button is available - user logged in", async () => {
  const user = {
    username: "testUser",
    email: "testUser@gmail.com",
    firstName: "Test",
    lastName: "User",
  };

  const store = configureStore({ reducer: root });
  store.dispatch({ type: "FETCH_USER", user: user });

  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  await act(async () => await new Promise(process.nextTick));

  expect(screen.getByText("My Routes")).toBeInTheDocument();
  expect(screen.getByText("Create Route")).toBeInTheDocument();
});

test("Displaying Routes for the user", async () => {
  const user = {
    username: "testUser",
    email: "testUser@gmail.com",
    firstName: "Test",
    lastName: "User",
  };

  const store = configureStore({ reducer: root });
  store.dispatch({ type: "FETCH_USER", user: user });

  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  await act(async () => await new Promise(process.nextTick));

  act(() => {
    fireEvent.click(screen.getByText(/My Routes/i));
  });
  await act(async () => await new Promise(process.nextTick));

  expect(screen.getByText("My Route 1")).toBeInTheDocument();
  expect(screen.getByText("My Route 2")).toBeInTheDocument();
  expect(screen.queryByText("My Route 3")).not.toBeInTheDocument();
});

test("Displaying Route Name and Notes", async () => {
  const user = {
    username: "testUser",
    email: "testUser@gmail.com",
    firstName: "Test",
    lastName: "User",
  };

  const store = configureStore({ reducer: root });
  store.dispatch({ type: "FETCH_USER", user: user });

  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  await act(async () => await new Promise(process.nextTick));

  act(() => {
    fireEvent.click(screen.getByText(/My Routes/i));
  });

  await act(async () => await new Promise(process.nextTick));

  act(() => {
    fireEvent.click(screen.getByText(/My Route 1/i));
  });

  await act(async () => await new Promise(process.nextTick));

  expect(screen.getByText("My Route 1")).toBeInTheDocument();
  expect(screen.getByTestId("ShowRoute1")).toBeInTheDocument();
});

test("Displaying Route Details", async () => {
  const user = {
    username: "testUser",
    email: "testUser@gmail.com",
    firstName: "Test",
    lastName: "User",
  };

  const store = configureStore({ reducer: root });
  store.dispatch({ type: "FETCH_USER", user: user });

  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  await act(async () => await new Promise(process.nextTick));

  act(() => {
    fireEvent.click(screen.getByText(/My Routes/i));
  });
  await act(async () => await new Promise(process.nextTick));

  act(() => {
    fireEvent.click(screen.getByText(/My Route 1/i));
  });

  act(() => {
    fireEvent.click(screen.getByTestId("ShowRoute1"));
  });
  const listItems = screen.getAllByRole("listitem");
  expect(listItems).toHaveLength(3);
  expect(screen.getByDisplayValue(/Portland/i)).toBeInTheDocument();
  expect(
    screen.getByDisplayValue("Whitman Mission National Historic Site")
  ).toBeInTheDocument();
  expect(
    screen.getByDisplayValue("John Day Fossil Beds National Monument")
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Save Changes" })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Delete Route" })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Google Maps" })
  ).toBeInTheDocument();
});

test("Deleting Route", async () => {
  const user = {
    username: "testUser",
    email: "testUser@gmail.com",
    firstName: "Test",
    lastName: "User",
  };

  const store = configureStore({ reducer: root });
  store.dispatch({ type: "FETCH_USER", user: user });

  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  await act(async () => await new Promise(process.nextTick));

  act(() => {
    fireEvent.click(screen.getByText(/My Routes/i));
  });
  await act(async () => await new Promise(process.nextTick));

  act(() => {
    fireEvent.click(screen.getByText(/My Route 2/i));
  });

  act(() => {
    fireEvent.click(screen.getByTestId("ShowRoute2"));
  });
  const listItems = screen.getAllByRole("listitem");
  expect(listItems).toHaveLength(2);
  expect(
    screen.getByDisplayValue(/Ice Age National Scenic Trail/i)
  ).toBeInTheDocument();
  expect(
    screen.getByDisplayValue("Herbert Hoover National Historic Site")
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Save Changes" })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Delete Route" })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Google Maps" })
  ).toBeInTheDocument();

  act(() => {
    fireEvent.click(screen.getByRole("button", { name: "Delete Route" }));
  });
  await act(async () => await new Promise(process.nextTick));

  expect(screen.getByText("My Route 1")).toBeInTheDocument();
  expect(screen.queryAllByLabelText("Waypoint")).toHaveLength(0);
});
