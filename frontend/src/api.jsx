import axios from "axios";

const BASE_URL = "http://localhost:3001";

class ParksApi {
  static token;

  static async request(endpoint, data = {}, method = "get") {
    //console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${ParksApi.token}` };
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      const message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  /* Register user */
  static async registerUser(user) {
    const res = await this.request(`users/register`, user, "post");
    ParksApi.token = res.token;
    return res;
  }

  /* Log in user */
  static async logInUser(user) {
    const res = await this.request(`users/login`, user, "post");
    ParksApi.token = res.token;
    return res;
  }

  /*Get user */
  static async getUserDetails(username) {
    const res = await this.request(`users/${username}`);
    return res;
  }

  /* Get all parks (user not logged in) */
  static async getAllParks(filters) {
    const res = await this.request(`parks/${filters}`);
    return res;
  }

  /* Get all parks plus visited by the user*/
  static async getAllParksForUser(username, filters) {
    const res = await this.request(`parks/${username}${filters}`);
    return res;
  }

  /*
  Mark as visited/not visited
  */
  static async markVisited(username, parkCode, visited) {
    const data = { username, parkCode, visited };
    const res = await this.request(`users/visited`, data, "post");
    return res;
  }

  /*
  Save user's notes about the park
  */
  static async saveNote(username, parkCode, note) {
    const data = { username, parkCode, note };
    const res = await this.request(`users/notes`, data, "post");
    return res;
  }

  /*
  Get user's notes about the park
  */
  static async getNote(username, parkCode) {
    const res = await this.request(`users/notes/${username}/${parkCode}`);
    return res;
  }

  /*
  Get all routes for user
  */
  static async getUserRoutes(username) {
    const res = await this.request(`routes/${username}`);
    return res;
  }

  static async createNewRoute(username, routeName, routeNotes, routeDetails) {
    const data = { username, routeName, routeNotes, routeDetails };
    const res = await this.request(`routes/new`, data, "post");
    return res;
  }

  static async deleteRoute(username, id) {
    const res = await this.request(
      `routes/${username}/${id}`,
      "data",
      "delete"
    );
    return res;
  }
  static async editRoute(username, routeId, routeNotes, routeDetails) {
    const data = { routeNotes, routeDetails };
    const res = await this.request(
      `routes/${username}/${routeId}`,
      data,
      "patch"
    );
    return res;
  }

  static async getParkDetails(parkCode) {
    const res = await this.request(`nps/${parkCode}`);
    return res;
  }
}

ParksApi.token = window.localStorage.token;

export default ParksApi;
