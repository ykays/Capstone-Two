
import ParksApi from "../api"

export function fetchUserDetailsFromAPI(username){
    return async function (dispatch) {
        try {
          const response = await ParksApi.getUserDetails(username)
          console.log(response.user)
          return dispatch(getUserDetails(response.user));
        }
        catch(e){
          console.log(e)
        }
        
      };
    }

export function removeUser(){
    return   async function (dispatch){
        return   dispatch(removedUser())
    }
}
    
    export function getUserDetails(user) {
      
      return {
        type: "FETCH_USER",
        user: user,
      };
    }

    export function removedUser() {
        return {
          type: "REMOVE_USER",
          user: [],
         
        };
      }
