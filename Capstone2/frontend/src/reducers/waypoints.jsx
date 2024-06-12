const initialState = [
  {
    name: "",
    latitude: "",
    longitude: "",
  },
];
export default function rootReducer(state = initialState, action) {
  switch (action.type) {
    case "FETCH_WAYPOINTS":
      return { state };
    case "FETCH_ADD_WAYPOINT":
      return { ...state, state: [action.waypoint] };
    case "REMOVE_WAYPOINT":
      return { ...state };

    //   return {
    //     ...state,
    //     posts: state.posts.filter((post) => post.id !== action.id),
    //     comments: state.comments.filter(
    //       (comment) => comment.postId !== action.id
    //     ),
    //   };

    default:
      return state;
  }
}
