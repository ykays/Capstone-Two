
export default function rootReducer(state = [], action) {
    switch (action.type) {
      case "FETCH_USER":
        return action.user;

      case "REMOVE_USER":
        return action.user;
    
      default:
        return state;
    }
  }