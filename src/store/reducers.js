import { combineReducers } from "redux";
import calibration from "./calibration/reducer";
import dataSave from "./dataSave/reducer";
import channelReducer from "./channel/channelSlice";
import loggerReducer from "./logger/loggerSlice";
import recorderReducer from "./recorder/recorderSlice";

const rootReducer = combineReducers({
  calibration,
  dataSave,
  channel: channelReducer,
  logger: loggerReducer,
  recorder: recorderReducer,
});

export default rootReducer;
