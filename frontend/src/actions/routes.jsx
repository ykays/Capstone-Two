import ParkApi from "../api";

export function fetchRoutesFromAPI(username) {
  return async function (dispatch) {
    try {
      const response = await ParkApi.getUserRoutes(username);
      if (Object.keys(response).length === 0) {
        return dispatch(getRoutes([]));
      }
      return dispatch(getRoutes(response.routes));
    } catch (e) {
      console.log(e);
    }
  };
}

export function createNewRoute(username, routeName, routeNotes, routeDetails) {
  return async function (dispatch) {
    try {
      const response = await ParkApi.createNewRoute(
        username,
        routeName,
        routeNotes,
        routeDetails
      );
      return dispatch(fetchRoutesFromAPI(username));
    } catch (e) {
      console.log(e);
    }
  };
}

export function deleteRoute(username, id) {
  return async function (dispatch) {
    try {
      const deleteRoute = await ParkApi.deleteRoute(username, id);
      return dispatch(fetchRoutesFromAPI(username));
    } catch (e) {
      console.log(e);
    }
  };
}

export function editRoute(username, routeId, routeNotes, routeDetails) {
  return async function (dispatch) {
    try {
      const editRoute = await ParkApi.editRoute(
        username,
        routeId,
        routeNotes,
        routeDetails
      );

      await dispatch(fetchRoutesFromAPI(username));
      return { msg: "Route saved", status: "success" };
    } catch (e) {
      console.log(e);
      return { msg: `Route not saved ${e}`, status: "error" };
    }
  };
}

export function getRoutes(routes) {
  return {
    type: "FETCH_ROUTES",
    routes: routes,
  };
}
