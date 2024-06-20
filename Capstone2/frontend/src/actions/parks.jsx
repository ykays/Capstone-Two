import { parksActionsFilters } from "../helpers/parksActionsHelper";
import ParkApi from "../api";

export function fetchParksFromAPI(filter = {}) {
  const URLFilter = parksActionsFilters(filter);

  return async function (dispatch) {
    try {
      const response = await ParkApi.getAllParks(URLFilter);
      return dispatch(getParks(response));
    } catch (e) {
      console.log(e);
    }
  };
}

export function fetchParksFromAPIForUser(username, filter = {}) {
  const URLFilter = parksActionsFilters(filter);
  return async function (dispatch) {
    try {
      const response = await ParkApi.getAllParksForUser(username, URLFilter);
      return dispatch(getParks(response));
    } catch (e) {
      console.log(e);
    }
  };
}

export function getParks(parks) {
  return {
    type: "FETCH_PARKS",
    parks: parks.parks,
  };
}
