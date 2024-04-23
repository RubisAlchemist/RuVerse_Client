import { combineReducers } from "redux";
import calibration from "./calibration/reducer";
import dataSave from './dataSave/reducer';

const rootReducer = combineReducers({
  calibration,
  dataSave,
});

export default rootReducer;
