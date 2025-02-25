import React, { useState, useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { fetchParksFromAPI, fetchParksFromAPIForUser } from "./actions/parks";
import { fetchFilterDataFromAPI } from "./actions/filters";
import { MapContainer, TileLayer } from "react-leaflet";
import Filters from "./Filters";
import ParkDetails from "./ParkDetails";
import MapRouteNew from "./MapRouteNew.jsx";
import ParkApi from "./api";
import CreateRoute from "./CreateRoute";
import MapMarker from "./MapMarker.jsx";
import Stack from "@mui/material/Stack";
import RoutesList from "./RoutesList.jsx";

/*
  Main Component of the App
  Displays the Map with all parks; parks details; user's visited parks and users notes
  Allows user to create and display the routes on the Map 

*/
const Map = ({ newRoute, setNewRoute }) => {
  // loading data from redux (user details, all patks, and filters data)
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user, shallowEqual);
  const parks = useSelector((store) => store.parks, shallowEqual);
  const filtersStates = useSelector(
    (store) => store.filters["states"],
    shallowEqual
  );
  const filtersType = useSelector(
    (store) => store.filters["parkType"],
    shallowEqual
  );
  const filtersActivity = useSelector(
    (store) => store.filters["parkActivity"],
    shallowEqual
  );
  const [isLoading, setIsLoading] = useState(true);

  /* 
    handling the filters based on which the Map component will be adjusted
    the state of filters is defined and stored in the Map 
    the filters selections are received from Filters Component based on user activity
  */
  const initialState = {
    states: [],
    parkType: [],
    activity: [],
  };
  const [filters, setFilters] = useState(initialState);

  const handleFilterStates = (val) => {
    return setFilters((filters) => ({ ...filters, states: val }));
  };
  const handleFilterType = (val) => {
    return setFilters((filters) => ({ ...filters, parkType: val }));
  };

  const handleFilterActivity = (val) => {
    return setFilters((filters) => ({ ...filters, activity: val }));
  };

  /* 
    handling the parkDetails drawer (whether should be display on the screen or not)
    the details are being handled in the ParkDetails Component 
  */
  const [parkDetails, setParkDetails] = useState(false);
  const [parkCode, setParkCode] = useState(null);

  const handleParkDetailsOpen = (parkCode) => {
    setParkCode(parkCode);
    setParkDetails(true);
  };
  const handleParkDetailsClose = (e) => {
    setParkCode(null);
    setParkDetails(false);
  };

  /* 
   handling the visited flag which determines the park icon color and buttons in the popup
   (if the user already visited the park, the icon will be green and button will have value of unvisited)
  */
  const [visited, setVisited] = useState(null);
  const getVisited = (val) => {
    setVisited(val);
  };

  const handleVisited = async (parkCode) => {
    try {
      const response = await ParkApi.markVisited(
        user.username,
        parkCode,
        !visited
      );
      dispatch(fetchParksFromAPIForUser(user.username, filters));
    } catch (e) {
      console.log(e);
    }
    setVisited(!visited);
  };

  /*
    handling new routes creation state to determine whether user can add a marker on the map or not by clicking on the map
    storing the route points user selected so the entire route can be displayed on the map
  */
  const [addOnMap, setAddOnMap] = useState(false);
  const [newRoutePoints, setNewRoutePoints] = useState([]);

  // fetching all parks to populate the map
  useEffect(() => {
    if (user.length !== 0) {
      dispatch(fetchParksFromAPIForUser(user.username, filters));
    } else {
      dispatch(fetchParksFromAPI(filters));
    }
    dispatch(fetchFilterDataFromAPI());
    if (filtersStates !== undefined) setIsLoading(false);
  }, [dispatch, user, filtersStates, filters]);

  // rendering the Map component
  if (isLoading) {
    return (
      <Box sx={{ position: "absolute", left: "50%", top: "50%" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Stack direction="row" sx={{ width: "100%" }}>
        <Filters
          filtersStates={filtersStates}
          filtersType={filtersType}
          filtersActivity={filtersActivity}
          handleFilterStates={handleFilterStates}
          handleFilterType={handleFilterType}
          handleFilterActivity={handleFilterActivity}
        />
        <CreateRoute
          setNewRoute={setNewRoute}
          setAddOnMap={setAddOnMap}
          setNewRoutePoints={setNewRoutePoints}
          newRoutePoints={newRoutePoints}
          user={user}
        />
        <RoutesList
          user={user}
          setAddOnMap={setAddOnMap}
          setNewRoutePoints={setNewRoutePoints}
          newRoutePoints={newRoutePoints}
          setNewRoute={setNewRoute}
        />
      </Stack>

      <MapContainer
        center={[39.809879, -98.556732]}
        zoom={4.5}
        scrollWheelZoom={false}
      >
        {newRoute && (
          <MapRouteNew
            setNewRoutePoints={setNewRoutePoints}
            newRoutePoints={newRoutePoints}
            setAddOnMap={setAddOnMap}
            addOnMap={addOnMap}
          />
        )}

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {parks.map((park) => (
          <MapMarker
            key={park.code}
            park={park}
            user={user}
            getVisited={getVisited}
            handleParkDetailsOpen={handleParkDetailsOpen}
            handleVisited={handleVisited}
            newRoutePoints={newRoutePoints}
            setNewRoutePoints={setNewRoutePoints}
            newRoute={newRoute}
            visited={visited}
          />
        ))}
        {parkDetails && (
          <ParkDetails
            parkCode={parkCode}
            handleParkDetailsClose={handleParkDetailsClose}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
