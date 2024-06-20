import React, { act } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SignIn from "./SignIn";
import App from "./App.jsx";
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
  it("displays the login details", async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    await act(async () => await new Promise(process.nextTick));
    fireEvent.click(screen.getByText(/Login/i));
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });
});
