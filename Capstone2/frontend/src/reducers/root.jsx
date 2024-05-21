import parks from "./parks";
import filters from './filters';
import user from './user'
import { combineReducers } from "redux";

export default combineReducers({
  parks,
  filters,
  user
});
