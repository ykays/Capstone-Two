import axios from "axios";

const BASE_URL =  "http://localhost:3001";

class ParksApi {
    static token;

    static async request(endpoint, data = {}, method = "get") {
        console.debug("API Call:", endpoint, data, method);
    
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
  static async getUserDetails(username){
    const res = await this.request(`users/${username}`)
    console.log(res)
    return res;
  }

  /* Get all parks plus visited by the user*/
  static async getAllParksForUser(username, filters){
    const res = await this.request(`parks/${username}${filters}`)
    return res;
  }
}

ParksApi.token = window.localStorage.token;

export default ParksApi;