
export default function rootReducer(state = [], action) {
    switch (action.type) {
      case "FETCH_USER":
        return action.user;

      case "REMOVE_USER":
        console.log("in remove reducer")
        state = action.user;
        console.log(state)
        return action.user;
    
      default:
        return state;
    }
  }