import { combineReducers } from "redux";
import calibration from "./calibration/reducer";

const rootReducer = combineReducers({
  calibration,
});

export default rootReducer;
