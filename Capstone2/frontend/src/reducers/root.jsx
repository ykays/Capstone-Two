import parks from "./parks";
import filters from './filters';
import { combineReducers } from "redux";

export default combineReducers({
  parks,
  filters
});
