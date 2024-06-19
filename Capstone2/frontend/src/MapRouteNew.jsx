import React, { useState, useEffect } from "react";
import { Marker, Popup, useMap, Tooltip, useMapEvents } from "react-leaflet";
import Button from "@mui/material/Button";
import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";

function MapRouteNew({
  setNewRoutePoints,
  newRoutePoints,
  setAddOnMap,
  addOnMap,
}) {
  // get all waypoints that should be display on the map
  const [points, setPoints] = useState(newRoutePoints);

  // if the points have changed, the component needs to be re-rendered
  useEffect(() => {
    setPoints(newRoutePoints);
  }, [newRoutePoints, setNewRoutePoints]);

  // if the user clicked on Add a Waypoint button, allow user to click and add waypoint
  const map = useMapEvents({
    click(e) {
      addOnMap
        ? setNewRoutePoints((points) => [
            ...newRoutePoints,
            [e.latlng.lat, e.latlng.lng],
          ])
        : null;
      setAddOnMap(false);
    },
  });

  // removing waypoint from the array and map, disable clicking/adding point to the map (until user click on Add a waypoint button)
  const removePoint = (e) => {
    points.splice(e.target.dataset.index, 1);
    setNewRoutePoints((points) => [...points]);
    setAddOnMap(false);
  };

  //styling the icon of a waypoint
  const redIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  // creating a route to be displayed on the map
  const createRoutineMachineLayer = () => {
    if (Object.keys(points).length === 0) return;

    const instance = L.Routing.control({
      waypoints: points.map((point) => L.latLng(point[0], point[1])),
      lineOptions: {
        styles: [{ color: "red", weight: 4 }],
      },
      show: false,
      addWaypoints: false,
      routeWhileDragging: true,
      draggableWaypoints: true,
      fitSelectedRoutes: true,
      showAlternatives: false,
      createMarker: function () {
        return null;
      },
    });

    return instance;
  };
  const RoutingMachine = createControlComponent(createRoutineMachineLayer);

  return (
    <>
      {points.map((point, indx) => {
        if (point[3] === undefined) {
          return (
            <Marker icon={redIcon} position={point} key={indx}>
              <Popup>
                <div style={{ textAlign: "center" }}>{[point[2]] || null}</div>
                <Button
                  data-index={indx}
                  color="secondary"
                  variant="outlined"
                  sx={{ width: 150, height: 20 }}
                  onClick={(e) => removePoint(e)}
                >
                  Remove
                </Button>
              </Popup>
            </Marker>
          );
        }
      })}
      {points.length > 1 && <RoutingMachine />}
    </>
  );
}

export default MapRouteNew;
