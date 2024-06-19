import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { Provider } from "react-redux";
import root from "./reducers/root.jsx";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({ reducer: root });
describe("App", () => {
  it("renders the App component without crashing", () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
  });
  it("matches snapshot", function () {
    const { asFragment } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
