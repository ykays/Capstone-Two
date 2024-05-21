import React, {useState, useEffect} from 'react';
import './App.css'
import NavBar from './NavBar'
import Map from './Map'
import ParksApi from './api'
import useLocalStorageState from './hooks/useLocalStorageState';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import { jwtDecode } from "jwt-decode";
import UserContext from "./UserContext";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useLocalStorageState("token");
  const [user, setUser] = useState();

  async function registerUser(user) {
    try{
      const userToken = await ParksApi.registerUser(user);
      setToken(userToken.token);
      return { success: true };
    }
    catch(err){
      return {success: false, err}
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
    setToken(undefined);
    setUser("");
  }

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    const decoded = jwtDecode(token);
    setUser((user) => (decoded.username));
  }, [token]);


  return (
    <>
    <UserContext.Provider value={{ user, setUser }}> 
      <NavBar registerUser={registerUser} logInUser={logInUser} logOutUser={logOutUser}/>
      <Map /> 
    </UserContext.Provider>
    
     
     
    </>
  )
}

export default App
