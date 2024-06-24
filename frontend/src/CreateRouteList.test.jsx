import React, { act } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import CreateRouteList from "./CreateRouteList.jsx";
import { Provider } from "react-redux";
import root from "./reducers/root.jsx";
import { configureStore } from "@reduxjs/toolkit";

const newRoutePoints = [
  [45.30580259943578, -122.69578185930418, "Portland"],
  [48.71171756, -121.2069423, "North Cascades National Park", "park"],
];
describe("CreateRoute smoke tests", () => {
  const store = configureStore({ reducer: root });
  it("renders the App component without crashing", () => {
    render(
      <Provider store={store}>
        <CreateRouteList newRoutePoints={newRoutePoints} />
      </Provider>
    );
  });
  it("matches snapshot", function () {
    const { asFragment } = render(
      <Provider store={store}>
        <CreateRouteList newRoutePoints={newRoutePoints} />
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
