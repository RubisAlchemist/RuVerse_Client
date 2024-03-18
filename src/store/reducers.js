import { combineReducers } from "redux";
import calibration from "./calibration/reducer";
import dataSave from "./dataSave/reducer";
import channelReducer from "./channel/channelSlice";

const rootReducer = combineReducers({
  calibration,
  dataSave,
  channel: channelReducer,
});

export default rootReducer;
