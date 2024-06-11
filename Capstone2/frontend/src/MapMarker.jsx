import React from "react";
import Tooltip from "@mui/material/Tooltip";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Button from "@mui/material/Button";

function MapMarker({
  park,
  user,
  getVisited,
  handleParkDetailsOpen,
  handleVisited,
  newRoutePoints,
  setNewRoutePoints,
  newRoute,
}) {
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
  return (
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
            sx={{ width: 100, height: 20 }}
            onClick={() => {
              console.log(newRoutePoints, park, "in park adding new one");

              setNewRoutePoints([
                ...newRoutePoints,
                [Number(park.latitude), Number(park.longitude)],
              ]);
            }}
          >
            Add to Route
          </Button>
        )}
      </Popup>
    </Marker>
  );
}

export default MapMarker;
