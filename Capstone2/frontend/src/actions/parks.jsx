import axios from "axios";
import ParkApi from "../api"

const API_URL = "http://localhost:3001/parks";

export function fetchParksFromAPI(filter={}) {
  let URL = API_URL
  let URLFilter ='';
  if(Object.keys(filter).length !== 0){
    if(filter.states.length !== 0){
      for(let state of filter.states){
        if(URLFilter.length === 0){
          URLFilter += `?state=${state}`
        }
        else{
          URLFilter += `&state=${state}`
        }
      }
    }
    if(filter.parkType.length !== 0){
      for(let type of filter.parkType){
        if(URLFilter.length === 0){
          URLFilter += `?park_type=${type}`
        }
        else{
          URLFilter += `&park_type=${type}`
        }
      }
    }
    if(filter.activity.length !== 0){
      for(let activity of filter.activity){
        if(URLFilter.length === 0){
          URLFilter += `?activity=${activity}`
        }
        else{
          URLFilter += `&activity=${activity}`
        }
      }
    }
  }
  return async function (dispatch) {
    try {
      const response = await axios.get(`${URL}${URLFilter}`);
      return dispatch(getParks(response.data));
    }
    catch(e){
      console.log(e)
    }
    
  };
}


export function fetchParksFromAPIForUser(username, filter={}) {
  let URL = `${API_URL}/${username}`
  let URLFilter ='';
  if(Object.keys(filter).length !== 0){
    if(filter.states.length !== 0){
      for(let state of filter.states){
        if(URLFilter.length === 0){
          URLFilter += `?state=${state}`
        }
        else{
          URLFilter += `&state=${state}`
        }
      }
    }
    if(filter.parkType.length !== 0){
      for(let type of filter.parkType){
        if(URLFilter.length === 0){
          URLFilter += `?park_type=${type}`
        }
        else{
          URLFilter += `&park_type=${type}`
        }
      }
    }
    if(filter.activity.length !== 0){
      for(let activity of filter.activity){
        if(URLFilter.length === 0){
          URLFilter += `?activity=${activity}`
        }
        else{
          URLFilter += `&activity=${activity}`
        }
      }
    }
  }
  return async function (dispatch) {
    try {
      const response = await ParkApi.getAllParksForUser(username, URLFilter)
      // console.log(`${URL}${URLFilter}`)
      // const response = await axios.get(`${URL}${URLFilter}`);
      console.log(response)
      return dispatch(getParks(response));
    }
    catch(e){
      console.log(e)
    }
    
  };
}

export function getParks(parks) {
  
  return {
    type: "FETCH_PARKS",
    parks: parks.parks,
  };
}
