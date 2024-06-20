import React, { act } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import MapMarker from "./MapMarker.jsx";
import { Provider } from "react-redux";
import root from "./reducers/root.jsx";
import { configureStore } from "@reduxjs/toolkit";

it("displays the park Marker details user not logged in", async () => {
  const store = configureStore({ reducer: root });
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  await act(async () => await new Promise(process.nextTick));
  fireEvent.click(screen.getByRole("button", { name: "Marker" }));
  expect(screen.getByText(/Acadia/i)).toBeInTheDocument();
  expect(screen.getByText(/Details/i)).toBeInTheDocument();
  expect(screen.getByText(/Visited/i)).toBeInTheDocument();
  expect(screen.getByText(/Visited/i)).toHaveAttribute("disabled");
});

it("displays the park Marker details user logged in", async () => {
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
  fireEvent.click(screen.getByRole("button", { name: "Marker" }));
  expect(screen.getByText(/Acadia/i)).toBeInTheDocument();
  expect(screen.getByText(/Details/i)).toBeInTheDocument();
  expect(screen.getByText(/Visited/i)).toBeInTheDocument();
  expect(screen.getByText(/Visited/i)).not.toHaveAttribute("disabled");
});

it("user logged in, mark park as visited", async () => {
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
  fireEvent.click(screen.getByRole("button", { name: "Marker" }));
  fireEvent.click(screen.getByText(/Visited/i));
  await act(async () => await new Promise(process.nextTick));
  expect(screen.getByText(/Unvisited/i)).toBeInTheDocument();
});
