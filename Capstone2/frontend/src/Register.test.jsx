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

test("registering user incorrect details", async () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  await act(async () => await new Promise(process.nextTick));
  fireEvent.click(screen.getByText(/Register/i));

  const username = screen.getByLabelText(/Username/i);
  act(() => {
    fireEvent.click(username);
    fireEvent.change(username, { target: { value: "testUser2" } });
  });

  const password = screen.getByLabelText(/Password/i);
  act(() => {
    fireEvent.click(password);
    fireEvent.change(password, { target: { value: "testUser2Password123" } });
  });

  const email = screen.getByLabelText(/Email Address/i);
  act(() => {
    fireEvent.click(email);
    fireEvent.change(email, { target: { value: "testUser2@gmail.com" } });
  });

  const firstName = screen.getByLabelText(/First Name/i);
  act(() => {
    fireEvent.click(firstName);
    fireEvent.change(firstName, { target: { value: "Test2" } });
  });

  const lastName = screen.getByLabelText(/Last Name/i);
  act(() => {
    fireEvent.click(lastName);
    fireEvent.change(lastName, { target: { value: "User2" } });
  });

  act(() => {
    fireEvent.click(screen.getByRole("button", { name: "Register" }));
  });

  await act(async () => await new Promise(process.nextTick));
  const form = document.querySelector("form div");
  console.log(form, "luuuuaa");
  await act(
    async () =>
      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
        expect(screen.getByRole("alert")).toHaveTextContent(
          "Duplicate username: testUser2"
        );
      })
  );
});

test("registering user correct details", async () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  await act(async () => await new Promise(process.nextTick));
  fireEvent.click(screen.getByText(/Register/i));

  const username = screen.getByLabelText(/Username/i);
  act(() => {
    fireEvent.click(username);
    fireEvent.change(username, { target: { value: "testUser" } });
  });

  const password = screen.getByLabelText(/Password/i);
  act(() => {
    fireEvent.click(password);
    fireEvent.change(password, { target: { value: "testUserPassword123" } });
  });

  const email = screen.getByLabelText(/Email Address/i);
  act(() => {
    fireEvent.click(email);
    fireEvent.change(email, { target: { value: "testUser@gmail.com" } });
  });

  const firstName = screen.getByLabelText(/First Name/i);
  act(() => {
    fireEvent.click(firstName);
    fireEvent.change(firstName, { target: { value: "Test" } });
  });

  const lastName = screen.getByLabelText(/Last Name/i);
  act(() => {
    fireEvent.click(lastName);
    fireEvent.change(lastName, { target: { value: "User" } });
  });

  act(() => {
    fireEvent.click(screen.getByRole("button", { name: "Register" }));
  });

  await act(async () => await new Promise(process.nextTick));
  await act(
    async () =>
      await waitFor(() => {
        expect(screen.getByText(/Logout/i)).toBeInTheDocument();
        expect(screen.queryByText(/Login/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Register/i)).not.toBeInTheDocument();
      })
  );
});
