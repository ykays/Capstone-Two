import React, { useState, useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { fetchRoutesFromAPI } from "./actions/routes";
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
import ParkApi from "./api";
import Tooltip from "@mui/material/Tooltip";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { List, ListItem, ListItemButton } from "@mui/material";
import RouteDetails from "./RouteDetails";
import { deleteRoute } from "./actions/routes";

const drawerWidth = 340;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

function RoutesList({
  user,
  setNewRoutePoints,
  setNewRoute,
  setAddOnMap,
  newRoutePoints,
}) {
  const dispatch = useDispatch();
  const userRoutes = useSelector((store) => store.routes, shallowEqual);

  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    dispatch(fetchRoutesFromAPI(user.username));
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
    setNewRoute(false);
    setNewRoutePoints([]);
  };

  useEffect(() => {
    if (user.length !== 0) {
      dispatch(fetchRoutesFromAPI(user.username));
    }
  }, [dispatch, user]);

  const deleteUserRoute = (id) => {
    dispatch(deleteRoute(user.username, id));
    dispatch(fetchRoutesFromAPI(user.username));
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
                )}
                <Typography>My Routes</Typography>
              </IconButton>
            </DrawerHeader>
            <Divider />
            {userRoutes.map((route) => (
              <RouteDetails
                key={route.id}
                route={route}
                user={user}
                setNewRoutePoints={setNewRoutePoints}
                setNewRoute={setNewRoute}
                deleteUserRoute={deleteUserRoute}
                setAddOnMap={setAddOnMap}
                newRoutePoints={newRoutePoints}
              />
            ))}
          </Drawer>
        </Box>
      </>
    );
  }

  return (
    <Stack direction="row" sx={{ width: "12%" }}>
      {user.length !== 0 && (
        <div>
          <Button onClick={handleDrawerOpen}>My Routes</Button>
        </div>
      )}
    </Stack>
  );
}

export default RoutesList;
