import React from "react";
import { render } from "@testing-library/react";
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
