const {
  CALIBRATION_FAIL,
  CALIBRATION_SUCCESS,
  SET_EYE_TRACKER,
} = require("./actionTypes");

const initialState = {
  calibrationData: null,
};

const calibration = (state = initialState, action) => {
  switch (action.type) {
    case CALIBRATION_SUCCESS:
      return {
        ...state,
        calibrationData: action.calibrationData,
      };
    // case  CALIBRATION_FAIL:
    //     console.error("[Calibration Fail] ", action.payload);
    //     return state;
    default:
      break;
  }
  return state;
};

export default calibration;
