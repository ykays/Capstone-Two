import React from "react";
import { render } from "@testing-library/react";
import Register from "./Register";
import { Provider } from "react-redux";
import root from "./reducers/root.jsx";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({ reducer: root });
describe("Register", () => {
  it("renders the Register component without crashing", () => {
    render(
      <Provider store={store}>
        <Register />
      </Provider>
    );
  });
  it("matches snapshot", function () {
    const { asFragment } = render(
      <Provider store={store}>
        <Register />
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
