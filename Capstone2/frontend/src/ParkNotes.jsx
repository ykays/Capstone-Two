import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import ParkApi from "./api";

/*
  If the user is logged in, the App will allow them to save a note about the park
  If the user is not logged in, 
  the message will be displayed to inform that only logged in user can save the note

  This component handles Park Note form, saving the notes, 
  and retrieving/displaying the notes that have already been saved by the user
*/
function ParkNotes({ user, parkCode }) {
  const [noteForm, setNoteForm] = useState("");
  const [msg, setMsg] = useState([]);

  useEffect(() => {
    async function getNote(username, parkCode) {
      try {
        const result = await ParkApi.getNote(username, parkCode);
        setNoteForm(result.park_notes);
      } catch (e) {
        console.log(e);
      }
    }
    getNote(user.username, parkCode);
  }, []);

  const handleChangeNote = (e) => {
    setNoteForm(e.target.value);
  };

  const handleSubmitNote = async () => {
    try {
      const result = await ParkApi.saveNote(user.username, parkCode, noteForm);
      return setMsg({ msg: "Note has been saved", status: "success" });
    } catch (e) {
      return setMsg({ msg: "Note has not been saved", status: "error" });
    }
  };

  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: 400 },
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        {msg.length !== 0 && <Alert severity={msg.status}>{msg.msg}</Alert>}
        <Typography variant="overline" display="block" textAlign="left">
          My Notes:
        </Typography>
        <TextField
          id="outlined-multiline-static"
          multiline
          rows={10}
          value={noteForm}
          onChange={handleChangeNote}
        />
        <Button variant="outlined" fullWidth onClick={handleSubmitNote}>
          Save
        </Button>
      </div>
    </Box>
  );
}

export default ParkNotes;
