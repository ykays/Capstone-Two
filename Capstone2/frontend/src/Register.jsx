import * as React from 'react';
import {useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';



const defaultTheme = createTheme();
 function Register({ open, onClose, registerUser }) {
  
  const initialState = {
    username: "",
    password:"",
    email: "",
    firstName: "",
    lastName: ""
  }
  const [formData, setFormData] = useState(initialState)

  const handleChange = (e)=> {
    const {name, value} = e.target;
    setFormData((form) => ({ ...form, [name]: value }));
  }

  const handleSubmit= async (e)=> {
    e.preventDefault()
    registerUser(formData);
    setFormData(initialState);
    
  }

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={onClose}
      >
        <DialogTitle>Register</DialogTitle>
        <DialogContent>
        <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              onChange={handleChange}
            />
              <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              onChange={handleChange}
            
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              onChange={handleChange}
            />
              <TextField
              margin="normal"
              required
              fullWidth
              name="firstName"
              label="First Name"
              id="firstName"
              onChange={handleChange}
              
            />
              <TextField
              margin="normal"
              required
              fullWidth
              name="lastName"
              label="Last Name"
              id="lastName"   
              onChange={handleChange}           
            />   
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>            
          </Box>
        </Box>     
      </Container>
    </ThemeProvider>
        </DialogContent>      
      </Dialog>
    </React.Fragment>
  );
}

export default Register;
