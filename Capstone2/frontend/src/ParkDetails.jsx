import * as React from 'react';
import {useState, useEffect, useCallback, useMemo} from 'react'
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';

import axios from "axios"

function ParkDetails({parkCode, handleParkDetailsClose}) {
console.log(parkCode, "parkCode at the beginning")

const [isLoading, setIsLoading] = useState(true)
const [park, setPark] = useState(null)


// const parkMemo = useMemo(()=> getParkDetails(parkCode), [parkCode])


// async function getParkDetails(parkCode){
//     const results = await axios.get(`https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}&api_key=6L5DF3fir451g48EkdjM9GvRnPgeoIEBYGi4DLxa`)
//     setPark(park=>results.data.data[0])
//     setIsLoading(false)
//     console.log(results.data)
//     console.log(park)
// }

// const getParkDetails = useCallback(async park => {
//     const results = await axios.get(`https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}&api_key=6L5DF3fir451g48EkdjM9GvRnPgeoIEBYGi4DLxa`)
//     setPark(results.data.data[0])
//     setIsLoading(false)
//     console.log(results.data)
// }, [parkCode])

//useEffect(() => { getParkDetails(parkCode); }, [parkCode, getParkDetails]);
useEffect(()=>{
getParkDetails(parkCode)
}, [])

async function getParkDetails(parkCode){
    try{
        console.log(`https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}`)
        const results = await axios.get(`https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}&api_key=6L5DF3fir451g48EkdjM9GvRnPgeoIEBYGi4DLxa`)
        setPark(results.data.data[0])
        setIsLoading(false)
        console.log(results.data.data[0])
    }
    catch(e){
        console.log(e)
        setIsLoading(false)

    }
 
}


  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Drawer open={open} onClose={handleParkDetailsClose}>
        <Box sx={{ width: 450 }} role="presentation" onClick={handleParkDetailsClose}>
            <Card>
                <CardContent sx={{textAlign: 'center'}}>
                    <Typography sx={{ fontSize: 30, textAlign: 'center'}}>{park.fullName}</Typography>
                    <img src={park.images[0].url} style={{heigt: "100px", width: "350px"}}/>
                    <Typography>{park.description}</Typography>
                    <CardActions>
                        <Button href={park.url} size="small">Learn More on NPS</Button>
                    </CardActions>
                

            <Divider />
            
            </CardContent>
            </Card>
         </Box>
      </Drawer>
    </div>
  );
}

export default ParkDetails;