import React, { useState, useEffect } from "react";
import "./App.css";
import NavBar from "./NavBar";
import Map from "./Map";
import ParksApi from "./api";
import useLocalStorageState from "./hooks/useLocalStorageState";
import { jwtDecode } from "jwt-decode";
import { fetchUserDetailsFromAPI, removeUser } from "./actions/user";
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useLocalStorageState("token");

  //function to register user (will be passed to Register Component)
  async function registerUser(user) {
    try {
      const userToken = await ParksApi.registerUser(user);
      setToken(userToken.token);
      return { success: true };
    } catch (err) {
      return { success: false, err };
    }
  }

  //function to register user (will be passed to Login Component)
  async function logInUser(user) {
    try {
      const userToken = await ParksApi.logInUser(user);
      setToken(userToken.token);
      return { success: true };
    } catch (err) {
      console.log(err, "LUAAAERRORAPP");
      return { success: false, err };
    }
  }

  //loging out user (removing from redux store and setting token to undefined in local storage)
  function logOutUser() {
    dispatch(removeUser());
    setToken(undefined);
  }

  // whenever the token changes (register, login, logout) the user details are retrieved and store in redux
  useEffect(() => {
    if (!token || token === undefined) {
      setIsLoading(false);
      return;
    }
    const decoded = jwtDecode(token);
    dispatch(fetchUserDetailsFromAPI(decoded.username));
  }, [token]);

  // setting state for creating new route to be able to manipulate the screen size of entire Map/App
  const [newRoute, setNewRoute] = useState(false);

  return (
    <div style={{ width: newRoute ? "83vw" : "100vw" }}>
      <NavBar
        registerUser={registerUser}
        logInUser={logInUser}
        logOutUser={logOutUser}
      />
      <Map newRoute={newRoute} setNewRoute={setNewRoute} />
    </div>
  );
}

export default App;
