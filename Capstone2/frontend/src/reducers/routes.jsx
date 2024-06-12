export default function rootReducer(state = [], action) {
  switch (action.type) {
    case "FETCH_ROUTES":
      return [...action.routes];

    default:
      return state;
  }
}
