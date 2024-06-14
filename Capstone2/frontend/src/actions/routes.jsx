import ParkApi from "../api";

export function fetchRoutesFromAPI(username) {
  return async function (dispatch) {
    try {
      const response = await ParkApi.getUserRoutes(username);
      return dispatch(getRoutes(response));
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
      return dispatch(getRoutes(response));
    } catch (e) {
      console.log(e);
    }
  };
}

export function getRoutes(routes) {
  return {
    type: "FETCH_ROUTES",
    routes: routes.routes,
  };
}
