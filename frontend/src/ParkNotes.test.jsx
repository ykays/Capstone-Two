import React, { act } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import ParkNotes from "./ParkNotes";
import { Provider } from "react-redux";
import root from "./reducers/root.jsx";
import { configureStore } from "@reduxjs/toolkit";

test("displays the park notes user saved", async () => {
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
  fireEvent.click(screen.getByRole("button", { name: "acad" }));
  fireEvent.click(screen.getByText(/Details/i));
  await act(async () => await new Promise(process.nextTick));
  expect(
    screen.getByText(
      /Acadia National Park protects the natural beauty of the highest rocky headlands along the Atlantic coastline of the United States, an abundance of habitats, and a rich cultural heritage./i
    )
  ).toBeInTheDocument();
  expect(screen.getByText(/My Notes:/i)).toBeInTheDocument();
  expect(screen.getByText(/To visit in 2024/i)).toBeInTheDocument();
});

test("displays the park notes user updated", async () => {
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
  fireEvent.click(screen.getByRole("button", { name: "acad" }));
  fireEvent.click(screen.getByText(/Details/i));
  await act(async () => await new Promise(process.nextTick));
  expect(
    screen.getByText(
      /Acadia National Park protects the natural beauty of the highest rocky headlands along the Atlantic coastline of the United States, an abundance of habitats, and a rich cultural heritage./i
    )
  ).toBeInTheDocument();
  expect(screen.getByText(/My Notes:/i)).toBeInTheDocument();

  fireEvent.change(screen.getByRole("textbox"), {
    target: { value: "To visit in 2024 or 2025" },
  });
  fireEvent.click(screen.getByText(/Save/i));
  await act(async () => await new Promise(process.nextTick));
  expect(screen.getByText(/To visit in 2024 or 2025/i)).toBeInTheDocument();
});
