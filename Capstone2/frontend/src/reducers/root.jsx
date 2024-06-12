import parks from "./parks";
import filters from "./filters";
import user from "./user";
import routes from "./routes";
import waypoints from "./waypoints";
import { combineReducers } from "redux";

export default combineReducers({
  parks,
  filters,
  user,
  routes,
  waypoints,
});
