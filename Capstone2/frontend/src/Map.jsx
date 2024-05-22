import React, { useState, useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { fetchParksFromAPI, fetchParksFromAPIForUser } from "./actions/parks";
import { fetchFilterDataFromAPI } from "./actions/filters";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Filters from "./Filters";
import Button from "@mui/material/Button";
import ParkDetails from "./ParkDetails";
import ParkApi from "./api";
import { handleFilters } from "./helpers/filtersHelper.jsx";

const Map = () => {
  // loading data from redux
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

  // handling the filters
  const initialState = {
    states: [],
    parkType: [],
    activity: [],
  };
  const [filters, setFilters] = useState(initialState);

  const handleFilterStates = (e) => {
    const filterValues = handleFilters(filters.states, e);
    return setFilters((filters) => ({ ...filters, states: filterValues }));
  };
  const handleFilterType = (e) => {
    const filterValues = handleFilters(filters.parkType, e);
    return setFilters((filters) => ({ ...filters, parkType: filterValues }));
  };

  const handleFilterActivity = (e) => {
    const filterValues = handleFilters(filters.activity, e);
    return setFilters((filters) => ({ ...filters, activity: filterValues }));
  };

  // handling the parkDetails drawer
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
  // handling the visited flag
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

  // styling different colors depending if the user visited park
  const greenIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const blueIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

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
      <Filters
        filtersStates={filtersStates}
        filtersType={filtersType}
        filtersActivity={filtersActivity}
        handleFilterStates={handleFilterStates}
        handleFilterType={handleFilterType}
        handleFilterActivity={handleFilterActivity}
      />
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
            icon={park.visited ? greenIcon : blueIcon}
            key={park.code}
            position={[Number(park.latitude), Number(park.longitude)]}
            eventHandlers={{ click: (e) => getVisited(park.visited) }}
          >
            <Popup>
              {park.name} <br />
              <Button
                onClick={() => handleParkDetailsOpen(park.code)}
                color="secondary"
                variant="outlined"
                sx={{ width: 100, height: 20 }}
              >
                Details
              </Button>
              {user.length !== 0 && (
                <Button
                  onClick={() => handleVisited(park.code)}
                  color="secondary"
                  variant="outlined"
                  sx={{ width: 100, height: 20 }}
                >
                  {visited ? "Unvisited" : "Visited"}
                </Button>
              )}
            </Popup>
          </Marker>
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
