import { combineReducers } from "redux";
import calibration from "./calibration/reducer";
import channelReducer from "./channel/channelSlice";
import dataSave from "./dataSave/reducer";
import loggerReducer from "./logger/loggerSlice";
import uploadReducer from "./upload/uploadSlice";

const rootReducer = combineReducers({
  calibration,
  dataSave,
  channel: channelReducer,
  logger: loggerReducer,
  upload: uploadReducer,
});

export default rootReducer;
