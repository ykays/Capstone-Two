import React, { act } from "react";
import {
  fireEvent,
  prettyDOM,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
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

test("loging user incorrect details", async () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  await act(async () => await new Promise(process.nextTick));
  fireEvent.click(screen.getByText(/Login/i));

  const username = screen.getByLabelText(/Username/i);
  act(() => {
    fireEvent.click(username);
    fireEvent.change(username, { target: { value: "incorrectUser" } });
  });

  const password = screen.getByLabelText(/Password/i);
  act(() => {
    fireEvent.click(password);
    fireEvent.change(password, { target: { value: "incorrectPassword" } });
  });

  act(() => {
    fireEvent.click(screen.getByRole("button", { name: "Sign In" }));
  });

  await act(async () => await new Promise(process.nextTick));
  await act(
    async () =>
      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
        expect(screen.getByRole("alert")).toHaveTextContent(
          "Invalid username/password"
        );
      })
  );
  //expect(screen.getByText("Invalid username/password")).toBeInTheDocument();
  // await act(
  //   async () =>
  //     await waitFor(() => {
  //       expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  //       expect(screen.queryByText(/Login/i)).not.toBeInTheDocument();
  //       expect(screen.queryByText(/Register/i)).not.toBeInTheDocument();
  //     })
  // );
});

test("loging user correct details", async () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  await act(async () => await new Promise(process.nextTick));
  fireEvent.click(screen.getByText(/Login/i));

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

  act(() => {
    fireEvent.click(screen.getByRole("button", { name: "Sign In" }));
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

test("logging out user", async () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  await act(async () => await new Promise(process.nextTick));

  act(() => {
    fireEvent.click(screen.getByRole("button", { name: "Logout" }));
  });

  await act(async () => await new Promise(process.nextTick));
  await act(
    async () =>
      await waitFor(() => {
        expect(screen.getByText(/Login/i)).toBeInTheDocument();
        expect(screen.queryByText(/Logout/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Register/i)).toBeInTheDocument();
      })
  );
});
