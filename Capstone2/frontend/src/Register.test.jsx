import React, { act } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "./App";
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
  it("displays the register details", async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    await act(async () => await new Promise(process.nextTick));
    fireEvent.click(screen.getByText(/Register/i));
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
  });
});
