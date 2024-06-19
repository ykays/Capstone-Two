import React from "react";
import { render } from "@testing-library/react";
import SignIn from "./SignIn";
import { Provider } from "react-redux";
import root from "./reducers/root.jsx";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({ reducer: root });
describe("SignIn", () => {
  it("renders the SignIn component without crashing", () => {
    render(
      <Provider store={store}>
        <SignIn />
      </Provider>
    );
  });
  it("matches snapshot", function () {
    const { asFragment } = render(
      <Provider store={store}>
        <SignIn />
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
