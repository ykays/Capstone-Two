import * as React from 'react';
import {useState, useContext} from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import PushPinIcon from '@mui/icons-material/PushPin';
import SignIn from './SignIn';
import Register from './Register';
import { useSelector, useDispatch, shallowEqual } from "react-redux";


function NavBar({registerUser, logInUser, logOutUser}) {
    const user = useSelector((store)=> store.user, shallowEqual)
    const [login, setLogin] = useState(false);

    const handleLoginOpen = (e)=> {
        setLogin(true)
    }
    const handleLoginClose = (e)=> {
        setLogin(false)
    }

    const [register, setRegister] = useState(false);

    const handleRegisterOpen = (e)=> {
        setRegister(true)
    }
    const handleRegisterClose = (e)=> {
        setRegister(false)
    }

  if(user.length === 0){
  return (
<div>
      <AppBar position="sticky">
        <Toolbar >
          <PushPinIcon /> <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
             Pin the Park
          </Typography>
          
          <Button onClick={handleLoginOpen} color="inherit">Login</Button>
          <Button onClick={handleRegisterOpen}  color="inherit">Register</Button>
        </Toolbar>
      </AppBar>
      {login && <SignIn open={handleLoginOpen} onClose={handleLoginClose} logInUser={logInUser}/>}
      {register && <Register open={handleRegisterOpen} onClose={handleRegisterClose} registerUser={registerUser}/>}
      </div>
  
  );}

  return (
    <div>
      <AppBar position="sticky">
        <Toolbar >
          <PushPinIcon /> <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
             Pin the Park
          </Typography>
          
          <Button onClick={logOutUser} color="inherit">Logout</Button>
          
        </Toolbar>
      </AppBar>
      </div>
  )
}

export default NavBar;
