import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Alert from "@mui/material/Alert";

const defaultTheme = createTheme();
function SignIn({ open, onClose, logInUser }) {
  //initial state for login form
  const initialState = {
    username: "",
    password: "",
  };

  //login form state
  const [formData, setFormData] = useState(initialState);

  //alert messages to be displayed once the user tries to login
  const [msg, setMsg] = useState([]);

  //function to handle the form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((form) => ({ ...form, [name]: value }));
  };

  //function to login user (calls function from App component)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await logInUser(formData);
    if (!result.success) {
      setMsg(result.err);
    }
    setFormData(initialState);
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Sign In</DialogTitle>
        <DialogContent>
          <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                  {msg.length !== 0 && <Alert severity="error">{msg}</Alert>}
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoFocus
                    value={formData.username}
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
                    value={formData.password}
                    onChange={handleChange}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign In
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

export default SignIn;
