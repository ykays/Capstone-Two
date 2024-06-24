export default function rootReducer(state = [], action) {
    switch (action.type) {
      case "FETCH_FILTERS":
        return action.filters;



        default:
            return state;
        }
      }