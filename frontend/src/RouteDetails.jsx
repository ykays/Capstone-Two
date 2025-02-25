import React, { useState, useEffect, useRef } from "react";
import { editRoute } from "./actions/routes";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import {
  Box,
  TextField,
  Divider,
  ButtonGroup,
  Alert,
  Link,
} from "@mui/material";

import AddLocationIcon from "@mui/icons-material/AddLocation";
import CreateRouteList from "./CreateRouteList";
import { routeReorder } from "./helpers/routeHelper";

/*
  Component to display the details of the user's saved route
  It displays the Name and Notes and once user clicks on Show Route Details,
  the component will render the route waypoints and will show the route on the map.

  The user can edit the route (and then hit Save Changes), the route will be saved in DB.
  The user can also delete the route and/or view the route in google maps.
*/

function RouteDetails({
  user,
  route,
  setNewRoutePoints,
  newRoutePoints,
  setNewRoute,
  deleteUserRoute,
  setAddOnMap,
}) {
  const dispatch = useDispatch();
  const [msg, setMsg] = useState([]);
  const [showRoute, setShowRoute] = useState(false);
  const [notesForm, setNotesForm] = useState(route.routeNotes);

  function getPointsFromAPI(points) {
    return points.map((point) => {
      return [
        Number(point.waypointLatitude),
        Number(point.waypointLongitude),
        point.waypointName,
        ...(point.parkFlag ? ["park"] : []),
        ...(point.parkFlag ? [point.parkCode] : []),
      ];
    });
  }

  const handleChangeNotes = (e) => {
    setNotesForm(e.target.value);
  };

  const handleShowRoute = (points) => {
    const routeWaypoints = getPointsFromAPI(points);
    setNewRoutePoints(routeWaypoints);
    setNewRoute(true);
    setShowRoute(true);
  };

  const handleSaveRoute = async (e) => {
    e.preventDefault();
    const routeNotes = notesForm;
    const routeDetails = newRoutePoints.map((point) => {
      return {
        waypointName: point[2],
        waypointLongitude: point[1],
        waypointLatitude: point[0],
        parkFlag: point[3] === "park" ? true : false,
        parkCode: point[3] === "park" ? point[4] : null,
      };
    });
    const res = await dispatch(
      editRoute(user.username, route.id, routeNotes, routeDetails)
    );
    setMsg(res);
  };

  const handleDeleteRoute = async (id) => {
    await deleteUserRoute(id);
    setNewRoutePoints([]);
  };

  const onDragEnd = ({ destination, source }) => {
    if (!destination) return;

    const newItems = routeReorder(
      newRoutePoints,
      source.index,
      destination.index
    );

    setNewRoutePoints(newItems);
  };

  const getCoordinates = (points) => {
    let coordinates = "";
    for (let point of points) {
      coordinates += `${point[0]},${point[1]}/`;
    }
    return `https://www.google.com/maps/dir/${coordinates}`;
  };

  return (
    <>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id={route.id}
        >
          {route.routeName}
        </AccordionSummary>
        <AccordionDetails>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 0.5, width: "25ch" },
            }}
            autoComplete="off"
            display="flex"
            flexDirection="column"
            onSubmit={(e) => {
              handleSaveRoute(e);
            }}
          >
            <TextField
              disabled
              id="outlined"
              label="Name"
              size="small"
              name="routeName"
              value={route.routeName}
              inputProps={{ required: true }}
            />
            <TextField
              id="outlined"
              label="Route Notes"
              size="small"
              name="routeNotes"
              defaultValue={route.routeNotes}
              onChange={handleChangeNotes}
            />
            <Divider />
            <Button
              variant="contained"
              data-testid={"ShowRoute" + route.id}
              onClick={() => handleShowRoute(route.details)}
            >
              Show Route
            </Button>

            {showRoute && (
              <div>
                <Button
                  size="small"
                  width="10vw"
                  color="primary"
                  variant="outlined"
                  onClick={() => setAddOnMap(true)}
                >
                  <AddLocationIcon></AddLocationIcon>Add Waypoint
                </Button>
                <CreateRouteList
                  newRoutePoints={newRoutePoints}
                  onDragEnd={onDragEnd}
                />
                {msg.length !== 0 && (
                  <Alert
                    severity={msg.status}
                    onClose={() => {
                      setMsg([]);
                    }}
                  >
                    {msg.msg}
                  </Alert>
                )}

                <ButtonGroup size="small" aria-label="Small button group">
                  <Button
                    type="submit"
                    variant="contained"
                    onClick={(e) => handleSaveRoute(e)}
                  >
                    Save Changes
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteRoute(route.id)}
                  >
                    Delete Route
                  </Button>
                  <Button variant="outlined">
                    <Link
                      type="button"
                      href={getCoordinates(newRoutePoints)}
                      target="_blank"
                    >
                      Google Maps
                    </Link>
                  </Button>
                </ButtonGroup>
              </div>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
    </>
  );
}

export default RouteDetails;
