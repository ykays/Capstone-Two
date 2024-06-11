import React, { useState, useEffect } from "react";
import { Marker, Popup, useMap, Tooltip, useMapEvents } from "react-leaflet";
import Button from "@mui/material/Button";
import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
//import { useSelector, useDispatch, shallowEqual } from "react-redux";

function MapRouteNew({ setNewRoutePoints, newRoutePoints }) {
  console.log(newRoutePoints);
  //mark to track user's clicks on the map
  const [mark, setMark] = useState(null);

  // once user clicks onto Add button, the mark will be added to the route points
  const [points, setPoints] = useState(newRoutePoints);

  const map = useMapEvents({
    click(e) {
      console.log(e);
      setMark([e.latlng.lat, e.latlng.lng]);
    },
  });

  const addToRoute = (point) => {
    setPoints((points) => [...newRoutePoints, point]);
    setNewRoutePoints((points) => [...newRoutePoints, point]);
  };

  const removePoint = (point) => {};

  const cancelMark = (mark) => {};

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

  console.log(points, "points in routing");
  if (points.length > 1) {
    return (
      <>
        <Marker icon={redIcon} position={mark}>
          <Popup>
            <Button
              color="secondary"
              variant="outlined"
              sx={{ width: 150, height: 20 }}
              onClick={() => addToRoute(mark)}
            >
              Add to route
            </Button>
            <Button
              color="primary"
              variant="outlined"
              sx={{ width: 100, height: 20 }}
              onClick={() => cancelMark(mark)}
            >
              Cancel
            </Button>
          </Popup>
        </Marker>
        {points.map((point, indx) => (
          <Marker icon={redIcon} position={point} key={indx}>
            <Popup>
              <Button
                color="secondary"
                variant="outlined"
                sx={{ width: 100, height: 20 }}
                onClick={() => removePoint(point)}
              >
                Remove
              </Button>
            </Popup>
          </Marker>
        ))}
        <RoutingMachine />
      </>
    );
  }
  if (mark && points.length < 2) {
    return (
      <>
        <Marker icon={redIcon} position={mark}>
          <Popup>
            <Button
              color="secondary"
              variant="outlined"
              sx={{ width: 100, height: 20 }}
              onClick={() => addToRoute(mark)}
            >
              Add to route
            </Button>
          </Popup>
        </Marker>
        {points.map((point, indx) => (
          <Marker icon={redIcon} position={point} key={indx}>
            <Popup>
              <Button
                color="secondary"
                variant="outlined"
                sx={{ width: 100, height: 20 }}
                onClick={() => removePoint(point)}
              >
                Add to route
              </Button>
            </Popup>
          </Marker>
        ))}
      </>
    );
  }
}

export default MapRouteNew;
