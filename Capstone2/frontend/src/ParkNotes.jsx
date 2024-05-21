import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import ParkApi from "./api"


function ParkNotes({user, parkCode}){

    const [noteForm, setNoteForm] = useState('')
    const [msg, setMsg] = useState([])
    
    useEffect(()=> {
        async function getNote(username, parkCode){
            try {
                const result = await ParkApi.getNote(username, parkCode)
                setNoteForm(result.park_notes)   
            }
            catch(e){
                console.log(e)
            }
        }
        getNote(user.username, parkCode)
    }, [])
    

    const handleChangeNote = (e)=> {
        setNoteForm(e.target.value)
    }

    const handleSubmitNote = async ()=> {
        try{
            const result = await ParkApi.saveNote(user.username, parkCode, noteForm)
            return setMsg({msg: "Note has been saved", status: "success"})
        }
        catch(e){
            return setMsg({msg: "Note has been saved", status: "error"})
        }
        

    }
    
    return (
        <Box component="form"
            sx={{
                '& .MuiTextField-root': { m: 1, width: 400 },
            }}
            noValidate
            autoComplete="off"
            >
                <div>
                {msg.length !== 0 && <Alert severity={msg.status}>{msg.msg}</Alert>}
                <TextField
                    id="outlined-multiline-static"
                    multiline
                    rows={10}
                    defaultValue={noteForm}
                    onChange={handleChangeNote}
                    
                    />
                <Button variant="outlined" fullWidth onClick={handleSubmitNote}>Save</Button>
                </div>

        </Box>
    )

}

export default ParkNotes;