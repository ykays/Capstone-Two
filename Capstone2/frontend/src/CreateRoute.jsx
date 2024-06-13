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

  const handleDrawerOpen = () => {
    setOpen(true);
    setNewRoute(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
    setNewRoute(false);
  };

  const [msg, setMsg] = useState([]);

  const handleSaveRoute = async (e) => {
    const routeName = e.target.parentElement.parentElement[0].value;
    const routeNotes = e.target.parentElement.parentElement[2].value;
    const routeDetails = newRoutePoints.map((point) => {
      return {
        waypointName: point[2],
        waypointLongitude: point[1],
        waypointLatitude: point[0],
      };
    });
    try {
      const result = await ParkApi.createNewRoute(
        user.username,
        routeName,
        routeNotes,
        routeDetails
      );
      e.target.parentElement.parentElement[0].value = "";
      e.target.parentElement.parentElement[2].value = "";
      setNewRoutePoints([]);
      return setMsg({ msg: "Route has been saved", status: "success" });
    } catch (e) {
      return setMsg({ msg: `Route has not been saved ${e}`, status: "error" });
    }
  };

  const handleCancelRoute = (e) => {
    e.target.parentElement.parentElement[0].value = "";
    e.target.parentElement.parentElement[2].value = "";
    setNewRoutePoints([]);
    setMsg([]);
  };

  if (open) {
    return (
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
              )}
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
          >
            {msg.length !== 0 && <Alert severity={msg.status}>{msg.msg}</Alert>}
            <div>
              <TextField
                required
                id="outlined-required"
                label="Name"
                size="small"
                name="routeName"
              />
            </div>
            <div>
              <TextField
                id="outlined"
                label="Route Notes"
                size="small"
                name="routeNotes"
              />
            </div>
            <Divider />
            <Button
              size="small"
              width="10vw"
              color="primary"
              variant="outlined"
              onClick={() => setAddOnMap(true)}
            >
              <AddLocationIcon></AddLocationIcon>Add Waypoint
            </Button>
            <div>
              {newRoutePoints.map((route, indx) => {
                if (!route[2]) {
                  return (
                    <TextField
                      key={indx}
                      required
                      id="outlined-required"
                      label="Waypoint"
                      size="small"
                      onChange={(e) => {
                        route[2] = e.target.value;
                      }}
                    />
                  );
                }

                return (
                  <TextField
                    key={indx}
                    disabled
                    id="outlined-disabled"
                    label="Waypoint"
                    value={route[2]}
                    size="small"
                  />
                );
              })}
            </div>
            {newRoutePoints.length > 1 && (
              <ButtonGroup size="small" aria-label="Small button group">
                {user.length !== 0 ? (
                  <Button
                    variant="contained"
                    onClick={(e) => {
                      handleSaveRoute(e);
                    }}
                  >
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
    );
  }

  return (
    <div style={{ textAlign: "right", width: "100%" }}>
      <Button onClick={handleDrawerOpen}>Create Route</Button>
    </div>
  );
}

export default CreateRoute;
