import axios from "axios";

const API_URL = "http://localhost:3001/parks/api/filters";

export function fetchFilterDataFromAPI() {
  return async function (dispatch) {
    try {
      const response = await axios.get(`${API_URL}`);
      return dispatch(getFilters(response.data));
    } catch (e) {
      console.log(e);
    }
  };
}

export function getFilters(filters) {
  return {
    type: "FETCH_FILTERS",
    filters: filters,
  };
}
