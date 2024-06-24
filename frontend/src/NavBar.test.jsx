import React from "react";
import { render } from "@testing-library/react";
import NavBar from "./NavBar";
import { Provider } from "react-redux";
import root from "./reducers/root.jsx";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({ reducer: root });
describe("NavBar", () => {
  it("renders the NavBar component without crashing", () => {
    render(
      <Provider store={store}>
        <NavBar />
      </Provider>
    );
  });
  it("matches snapshot", function () {
    const { asFragment } = render(
      <Provider store={store}>
        <NavBar />
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
