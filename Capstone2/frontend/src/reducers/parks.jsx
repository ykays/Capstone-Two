
export default function rootReducer(state = [], action) {
  switch (action.type) {
    case "FETCH_PARKS":
      return [...action.parks];

    default:
      return state;
  }
}
