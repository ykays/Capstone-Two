import React, { act } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import Filters from "./Filters.jsx";
import { Provider } from "react-redux";
import root from "./reducers/root.jsx";
import { configureStore } from "@reduxjs/toolkit";

test("filters data on the map - marker present", async () => {
  const store = configureStore({ reducer: root });
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  await act(async () => await new Promise(process.nextTick));
  const textbox = document.querySelector("#filterState");

  await act(async () => {
    fireEvent.click(textbox);
    fireEvent.change(textbox, { target: { value: "me" } });
    fireEvent.keyDown(textbox, { key: "ArrowDown", code: "MetaLeft" });
    fireEvent.keyDown(textbox, { key: "Enter", code: "Enter" });
  });

  await act(async () => await new Promise(process.nextTick));

  await act(
    async () =>
      await waitFor(() => {
        const markers = screen.getAllByRole("button", { name: "Marker" });
        expect(markers.length).toBe(1);
      })
  );
});

test("filters data on the map - marker not present", async () => {
  const store = configureStore({ reducer: root });
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  await act(async () => await new Promise(process.nextTick));

  const textbox = document.querySelector("#filterState");

  await act(async () => {
    fireEvent.click(textbox);
    fireEvent.change(textbox, { target: { value: "az" } });
    fireEvent.keyDown(textbox, { key: "ArrowDown", code: "MetaLeft" });
    fireEvent.keyDown(textbox, { key: "Enter", code: "Enter" });
  });

  await act(async () => await new Promise(process.nextTick));

  await act(
    async () =>
      await waitFor(() => {
        const markers = screen.queryAllByRole("button", { name: "Marker" });
        expect(markers.length).toBe(0);
      })
  );
});

test("filters data on the map - marker not present and then filter removed", async () => {
  const store = configureStore({ reducer: root });
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  await act(async () => await new Promise(process.nextTick));

  const textbox = document.querySelector("#filterState");

  await act(async () => {
    fireEvent.click(textbox);
    fireEvent.change(textbox, { target: { value: "az" } });
    fireEvent.keyDown(textbox, { key: "ArrowDown", code: "MetaLeft" });
    fireEvent.keyDown(textbox, { key: "Enter", code: "Enter" });
  });

  await act(async () => await new Promise(process.nextTick));

  await act(
    async () =>
      await waitFor(() => {
        const markers = screen.queryAllByRole("button", { name: "Marker" });
        expect(markers.length).toBe(0);
      })
  );
  const closeButton = screen.getByTestId("CancelIcon");
  await act(async () => {
    fireEvent.click(closeButton);
  });

  await act(async () => await new Promise(process.nextTick));

  await act(
    async () =>
      await waitFor(() => {
        const markers = screen.queryAllByRole("button", { name: "Marker" });
        expect(markers.length).toBe(1);
      })
  );
});
