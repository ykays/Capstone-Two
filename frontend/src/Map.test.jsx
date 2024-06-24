import React from "react";
import { render } from "@testing-library/react";
import Map from "./Map";
import { Provider } from "react-redux";
import root from "./reducers/root.jsx";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({ reducer: root });
describe("Map", () => {
  it("renders the Map component without crashing", () => {
    render(
      <Provider store={store}>
        <Map />
      </Provider>
    );
  });
  it("matches snapshot", function () {
    const { asFragment } = render(
      <Provider store={store}>
        <Map />
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
