import React, { useState, useEffect } from "react";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { TextField } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import ParkApi from "./api";
import Tooltip from "@mui/material/Tooltip";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import { routeReorder } from "./helpers/routeHelper";
import CreateRouteList from "./CreateRouteList";
import Stack from "@mui/material/Stack";

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

function CreateRoute({
  setNewRoute,
  setAddOnMap,
  setNewRoutePoints,
  newRoutePoints,
  user,
}) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [routeNameNotes, setRouteNameNotes] = useState({
    routeName: "",
    routeNotes: "",
  });

  const handleDrawerOpen = () => {
    setOpen(true);
    setNewRoute(true);
    setNewRoutePoints([]);
  };

  const handleDrawerClose = () => {
    setOpen(false);
    setNewRoute(false);
  };

  const [msg, setMsg] = useState([]);

  const handleChangeRouteNameNotes = (e) => {
    const { name, value } = e.target;
    setRouteNameNotes((form) => ({ ...form, [name]: value }));
  };

  const handleSaveRoute = async (e) => {
    e.preventDefault();

    const routeName = routeNameNotes["routeName"];
    const routeNotes = routeNameNotes["routeNotes"];
    // const routeName = e.target[0].value;
    // const routeNotes = e.target[2].value;

    const routeDetails = newRoutePoints.map((point) => {
      return {
        waypointName: point[2],
        waypointLongitude: point[1],
        waypointLatitude: point[0],
        parkFlag: point[3] === "park" ? true : false,
        parkCode: point[3] === "park" ? point[4] : null,
      };
    });

    try {
      const result = await ParkApi.createNewRoute(
        user.username,
        routeName,
        routeNotes,
        routeDetails
      );
      routeNameNotes["routeName"] = "";
      routeNameNotes["routeNotes"] = "";
      setNewRoutePoints([]);
      return setMsg({ msg: "Route saved", status: "success" });
    } catch (e) {
      return setMsg({ msg: `Route not saved ${e}`, status: "error" });
    }
  };

  const handleCancelRoute = (e) => {
    routeNameNotes["routeName"] = "";
    routeNameNotes["routeNotes"] = "";
    setNewRoutePoints([]);
    setMsg([]);
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

  if (open) {
    return (
      <>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: drawerWidth,
              },
            }}
            variant="persistent"
            anchor="right"
            open={open}
          >
            <DrawerHeader>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "rtl" ? (
                  <ChevronLeftIcon />
                ) : (
                  <ChevronRightIcon />
                )}{" "}
                <Typography>New Route</Typography>
              </IconButton>
            </DrawerHeader>
            <Divider />

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

              <TextField
                className="required"
                required
                id="outlined-required"
                label="Name"
                size="small"
                name="routeName"
                value={routeNameNotes.routeName}
                inputProps={{ required: true }}
                onChange={handleChangeRouteNameNotes}
              />

              <TextField
                id="outlined"
                label="Route Notes"
                size="small"
                name="routeNotes"
                value={routeNameNotes.routeNotes}
                onChange={handleChangeRouteNameNotes}
              />

              <Divider />
              <Typography style={{ fontSize: "0.6rem" }}>
                To add a Waypoint, click on 'Add Waypoint' and then either click
                on a map or select a park & add to route
              </Typography>
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
                onDragEnd={onDragEnd}
                newRoutePoints={newRoutePoints}
              />
              {newRoutePoints.length > 1 && (
                <ButtonGroup size="small" aria-label="Small button group">
                  {user.length !== 0 ? (
                    <Button type="submit" variant="contained">
                      Save Route
                    </Button>
                  ) : (
                    <Tooltip
                      title="Please log in to save the route"
                      placement="top-start"
                    >
                      <span>
                        <Button variant="contained" disabled>
                          Save Route
                        </Button>
                      </span>
                    </Tooltip>
                  )}
                  <Button
                    variant="outlined"
                    onClick={(e) => handleCancelRoute(e)}
                  >
                    Cancel
                  </Button>
                </ButtonGroup>
              )}
            </Box>
          </Drawer>
        </Box>
      </>
    );
  }

  return (
    <Stack direction="row" sx={{ width: "12%" }}>
      <div>
        <Button onClick={handleDrawerOpen}>Create Route</Button>
      </div>
    </Stack>
  );
}

export default CreateRoute;
