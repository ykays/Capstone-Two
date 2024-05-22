import React, { useState, useEffect } from "react";
import "./App.css";
import NavBar from "./NavBar";
import Map from "./Map";
import ParksApi from "./api";
import useLocalStorageState from "./hooks/useLocalStorageState";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { fetchUserDetailsFromAPI, removeUser } from "./actions/user";
import { useSelector, useDispatch, shallowEqual } from "react-redux";

function App() {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useLocalStorageState("token");

  async function registerUser(user) {
    try {
      const userToken = await ParksApi.registerUser(user);
      setToken(userToken.token);
      return { success: true };
    } catch (err) {
      return { success: false, err };
    }
  }

  async function logInUser(user) {
    try {
      const userToken = await ParksApi.logInUser(user);
      setToken(userToken.token);
      return { success: true };
    } catch (err) {
      return { success: false, err };
    }
  }

  function logOutUser() {
    dispatch(removeUser());
    setToken(undefined);
  }

  useEffect(() => {
    if (!token || token === undefined) {
      setIsLoading(false);
      return;
    }
    const decoded = jwtDecode(token);
    dispatch(fetchUserDetailsFromAPI(decoded.username));
  }, [token]);

  return (
    <>
      <NavBar
        registerUser={registerUser}
        logInUser={logInUser}
        logOutUser={logOutUser}
      />
      <Map />
    </>
  );
}

export default App;
