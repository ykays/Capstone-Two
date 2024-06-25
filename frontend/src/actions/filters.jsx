import axios from "axios";

const API_URL = import.meta.env.VITE_APP_BASE_URL || "http://localhost:3001";

export function fetchFilterDataFromAPI() {
  return async function (dispatch) {
    try {
      const response = await axios.get(`${API_URL}/parks/api/filters`);
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
