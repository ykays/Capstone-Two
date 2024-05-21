import React, { useState, useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import {fetchParksFromAPI} from "./actions/parks"
import {fetchFilterDataFromAPI} from "./actions/filters"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import Filters from "./Filters";
import {Link} from "react-router-dom"
import Button from '@mui/material/Button';
import ParkDetails from "./ParkDetails";



const Map = () => {
  const dispatch = useDispatch()
  const parks = useSelector((store)=> store.parks, shallowEqual)
  const filtersStates = useSelector((store)=> store.filters['states'], shallowEqual)
  const filtersType = useSelector((store)=> store.filters['parkType'], shallowEqual)
  const filtersActivity = useSelector((store)=> store.filters['parkActivity'], shallowEqual)
  const [isLoading, setIsLoading] = useState(true);

  //////
  const [parkDetails, setParkDetails] = useState(false)
  //const [parkCode, setParkCode] = useState(null)
  const handleParkDetailsOpen = (e)=> {
    console.log(e)
    //setParkCode(code)
    setParkDetails(true)
    //console.log(parkCode, "parkCode in open")
  }
  const handleParkDetailsClose = (e)=> {
    //setParkCode(null)
    setParkDetails(false)
    //console.log(parkCode, "parkCode in close")

    
  }

  const handleVisited = (e)=> {
    console.log(e)
  }
  ////////

  useEffect(()=>{  
    dispatch(fetchParksFromAPI())
    dispatch(fetchFilterDataFromAPI())
    setIsLoading(false)   
  }, [dispatch])

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Filters filtersStates={filtersStates} filtersType={filtersType} filtersActivity={filtersActivity}/>
      <MapContainer
        center={[39.809879, -98.556732]}
        zoom={4.5}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {parks.map((park) => (
          <Marker
            key={park.code}
            position={[Number(park.latitude), Number(park.longitude)]}
            
          >
            <Popup >
              {park.name} <br />
              <Button onClick={handleParkDetailsOpen} 
              color="secondary" variant="outlined" sx={{width:100, height:20}} >Details</Button>
              {parkDetails && <ParkDetails parkCode={park.code} handleParkDetailsClose={handleParkDetailsClose}/>}
            <Button onClick={handleVisited} 
              color="secondary" variant="outlined" sx={{width:100, height:20}} >Visited</Button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
