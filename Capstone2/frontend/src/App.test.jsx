import React, { act } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import { Provider } from "react-redux";
import root from "./reducers/root.jsx";
import { configureStore } from "@reduxjs/toolkit";

describe("App smoke tests", () => {
  const store = configureStore({ reducer: root });
  it("renders the App component without crashing", () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
  });
  it("matches snapshot", function () {
    const { asFragment } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

it("displays the main page with filters and NavBar user not logged in", async () => {
  const store = configureStore({ reducer: root });
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  await act(async () => await new Promise(process.nextTick));
  await act(
    async () =>
      await waitFor(() => {
        expect(screen.getByText(/Pin the Park/i)).toBeInTheDocument();
        expect(screen.getByText(/Login/i)).toBeInTheDocument();
        expect(screen.getByText(/Register/i)).toBeInTheDocument();
        expect(screen.queryByText(/Logout/i)).not.toBeInTheDocument();
        expect(screen.getByText(/Filter By State/i)).toBeInTheDocument();
        expect(screen.getByText(/Filter By Park/i)).toBeInTheDocument();
        expect(screen.getByText(/Filter By Activity/i)).toBeInTheDocument();
        expect(screen.getByText(/Create Route/i)).toBeInTheDocument();
      })
  );
});

it("displays the park Markers on the map", async () => {
  const store = configureStore({ reducer: root });
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  await act(async () => await new Promise(process.nextTick));
  const markers = screen.getAllByRole("button", { name: "Marker" });
  expect(markers.length).toBe(1);
});

it("displays the main page with filters and NavBar user logged in", async () => {
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
  await act(
    async () =>
      await waitFor(() => {
        expect(screen.getByText(/Pin the Park/i)).toBeInTheDocument();
        expect(screen.getByText(/Logout/i)).toBeInTheDocument();
        expect(screen.queryByText(/Register/i)).not.toBeInTheDocument();
        expect(screen.getByText(/Filter By State/i)).toBeInTheDocument();
        expect(screen.getByText(/Filter By Park/i)).toBeInTheDocument();
        expect(screen.getByText(/Filter By Activity/i)).toBeInTheDocument();
        expect(screen.getByText(/Create Route/i)).toBeInTheDocument();
        expect(screen.getByText(/My Routes/i)).toBeInTheDocument();
      })
  );
});
