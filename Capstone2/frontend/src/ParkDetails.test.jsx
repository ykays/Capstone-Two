import React, { act } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import ParkDetails from "./ParkDetails";
import { Provider } from "react-redux";
import root from "./reducers/root.jsx";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({ reducer: root });
describe("ParkDetails", () => {
  it("renders the ParkDetails component without crashing", () => {
    render(
      <Provider store={store}>
        <ParkDetails />
      </Provider>
    );
  });
  it("matches snapshot", function () {
    const { asFragment } = render(
      <Provider store={store}>
        <ParkDetails />
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

test("displays the single park details user not logged in", async () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  await act(async () => await new Promise(process.nextTick));
  fireEvent.click(screen.getByRole("button", { name: "Marker" }));
  fireEvent.click(screen.getByText(/Details/i));
  await act(async () => await new Promise(process.nextTick));
  expect(
    screen.getByText(
      /Acadia National Park protects the natural beauty of the highest rocky headlands along the Atlantic coastline of the United States, an abundance of habitats, and a rich cultural heritage./i
    )
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      /Please log in or register to save a note about this park/i
    )
  ).toBeInTheDocument();
});

test("displays the single park details user logged in", async () => {
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
  fireEvent.click(screen.getByText(/Details/i));
  await act(async () => await new Promise(process.nextTick));
  expect(
    screen.getByText(
      /Acadia National Park protects the natural beauty of the highest rocky headlands along the Atlantic coastline of the United States, an abundance of habitats, and a rich cultural heritage./i
    )
  ).toBeInTheDocument();
  expect(screen.getByText(/My Notes:/i)).toBeInTheDocument();
});
