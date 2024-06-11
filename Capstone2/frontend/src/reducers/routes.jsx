const initialState = { routes: [], newRoutePoints: [] };
export default function rootReducer(state = initialState, action) {
  switch (action.type) {
    case "FETCH_ROUTES":
      return { ...state, routes: action.routes };
    case "FETCH_NEW_ROUTE_POINTS":
      return [state.newRoutePoints];
    case "ADD_NEW_ROUTE_POINT":
      return {
        ...state,
        newRoutePoints: [...state.newRoutePoints, action.newRoutePoint],
      };
    default:
      return state;
  }
}
