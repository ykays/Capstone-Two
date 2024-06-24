import React, { useState, useEffect } from "react";
import Tooltip from "@mui/material/Tooltip";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Button from "@mui/material/Button";

/*
  Component to display park Markers
  Within each Marker, the user can click to display Park Details, 
  if the user is logged in, they can also mark the park as visited(the icon will become green)

  During the route creation, once the user click on the Park Marker, 
  additional button will appear - Add to Route (or Remove from Route)
  which will allow user to add the park to their route 
*/
function MapMarker({
  park,
  user,
  getVisited,
  handleParkDetailsOpen,
  handleVisited,
  newRoutePoints,
  setNewRoutePoints,
  newRoute,
  visited,
}) {
  // styling different colors depending if the user visited park or added to the route
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

  const orangeIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  /*
   list of parks that were added to the route by the user 
   (to help get diff icon and set remove/add to route button)
  */
  const [parkOnRoute, setParkOnRoute] = useState([]);

  /* 
    if user cancels entire route (newRoutePoints will have length of 0) 
    then the parkOnRoute needs to be cleared, too
    otherwise, checking if the route point is park and adding parkOnRoute list
  */
  useEffect(() => {
    if (newRoutePoints.length === 0) {
      return setParkOnRoute([]);
    }
    setParkOnRoute(
      newRoutePoints.map((point) => {
        if (point[4]) return point[4];
      })
    );
  }, [newRoutePoints]);

  /*
  if user is in the 'create route mode' this function will be called to add park to the route
  it will also add park to Park on route list (to style icon differently and still have park buttons)
   */
  const addParkToRoute = (latitude, longitude, name, code) => {
    setNewRoutePoints([
      ...newRoutePoints,
      [latitude, longitude, name, "park", code],
    ]);
    setParkOnRoute((parks) => [...parks, code]);
  };

  /*
    if user is in the 'create route mode' this function will be called to remove park to the route
    it will also remove park to Park on route list (to style icon differently and still have park buttons)
   */

  const removeParkFromRoute = (code) => {
    setNewRoutePoints(newRoutePoints.filter((point) => point[4] !== code));
    setParkOnRoute((parks) => parks.filter((park) => park !== code));
  };

  /* 
  styling the park icon differently if the park is in the user's route
  helps not only to display different color of the makrer (orange)
  but also to keep the buttons to display Park Details, mark as Visited.
  Includes Remove From route button
  */

  if (parkOnRoute.includes(park.code)) {
    return (
      <Marker
        icon={orangeIcon}
        key={park.code}
        position={[Number(park.latitude), Number(park.longitude)]}
        eventHandlers={{ click: (e) => getVisited(park.visited) }}
        alt={park.code}
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
          {user.length !== 0 ? (
            <Button
              onClick={() => handleVisited(park.code)}
              color="secondary"
              variant="outlined"
              sx={{ width: 100, height: 20 }}
            >
              {visited ? "Unvisited" : "Visited"}
            </Button>
          ) : (
            <Tooltip
              title="Please log in to mark this park as visited"
              placement="top-start"
            >
              <span>
                <Button
                  color="secondary"
                  variant="outlined"
                  sx={{ width: 100, height: 20 }}
                  disabled
                >
                  Visited
                </Button>
              </span>
            </Tooltip>
          )}
          {newRoute && (
            <Button
              color="secondary"
              variant="outlined"
              sx={{ width: 200, height: 20 }}
              onClick={() => removeParkFromRoute(park.code)}
            >
              Remove from Route
            </Button>
          )}
        </Popup>
      </Marker>
    );
  }

  // if the park is not part of the user's route
  return (
    <Marker
      icon={park.visited ? greenIcon : blueIcon}
      key={park.code}
      position={[Number(park.latitude), Number(park.longitude)]}
      eventHandlers={{ click: (e) => getVisited(park.visited) }}
      alt={park.code}
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
        {user.length !== 0 ? (
          <Button
            onClick={() => handleVisited(park.code)}
            color="secondary"
            variant="outlined"
            sx={{ width: 100, height: 20 }}
          >
            {visited ? "Unvisited" : "Visited"}
          </Button>
        ) : (
          <Tooltip
            title="Please log in to mark this park as visited"
            placement="top-start"
          >
            <span>
              <Button
                color="secondary"
                variant="outlined"
                sx={{ width: 100, height: 20 }}
                disabled
              >
                Visited
              </Button>
            </span>
          </Tooltip>
        )}
        {newRoute && (
          <Button
            color="secondary"
            variant="outlined"
            sx={{ width: 150, height: 20 }}
            onClick={() =>
              addParkToRoute(
                Number(park.latitude),
                Number(park.longitude),
                park.name,
                park.code
              )
            }
          >
            Add to Route
          </Button>
        )}
      </Popup>
    </Marker>
  );
}

export default MapMarker;
