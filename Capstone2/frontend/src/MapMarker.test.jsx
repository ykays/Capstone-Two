import React from "react";
import { render } from "@testing-library/react";
import MapMarker from "./MapMarker";
import { Provider } from "react-redux";
import root from "./reducers/root.jsx";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({ reducer: root });
describe("MapMarker", () => {
  it("renders the MapMarker component without crashing", () => {
    render(
      <Provider store={store}>
        <MapMarker />
      </Provider>
    );
  });
  it("matches snapshot", function () {
    const { asFragment } = render(
      <Provider store={store}>
        <MapMarker />
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
