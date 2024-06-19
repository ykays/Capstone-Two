import React from "react";
import { render } from "@testing-library/react";
import ParkNotes from "./ParkNotes";
import { Provider } from "react-redux";
import root from "./reducers/root.jsx";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({ reducer: root });
describe("ParkNotes", () => {
  it("renders the ParkNotes component without crashing", () => {
    render(
      <Provider store={store}>
        <ParkNotes />
      </Provider>
    );
  });
  it("matches snapshot", function () {
    const { asFragment } = render(
      <Provider store={store}>
        <ParkNotes />
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
