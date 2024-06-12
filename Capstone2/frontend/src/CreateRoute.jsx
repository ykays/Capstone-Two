import React, { useState } from "react";
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

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

function CreateRoute({ setNewRoute, setAddOnMap, newRoutePoints }) {
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

  /////

  const [addWaypoint, setAddWaypoint] = useState(false);
  const [waypoints, setWaypoints] = useState([]);

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
            noValidate
            autoComplete="off"
            display="flex"
            flexDirection="column"
          >
            <div>
              <TextField
                required
                id="outlined-required"
                label="Name"
                defaultValue=""
              />
            </div>
            <div>
              <TextField id="outlined" label="Route Notes" defaultValue="" />
            </div>
            <Divider />
            <Button
              color="primary"
              variant="outlined"
              onClick={() => setAddOnMap(true)}
            >
              <AddLocationIcon></AddLocationIcon>Add Waypoint
            </Button>
            <div>
              {newRoutePoints.map((route, indx) => (
                <TextField
                  key={indx}
                  disabled
                  id="outlined-disabled"
                  label="Waypoint"
                  defaultValue={route}
                  rows={4}
                />
              ))}
            </div>
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
