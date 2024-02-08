import { createPromiseAction } from "@adobe/redux-saga-promise";
import {
  CALIBRATION_FAIL,
  CALIBRATION_SUCCESS,
  SET_EYE_TRACKER,
} from "./actionTypes";

// export const calibrationPromise = createPromiseAction('CALIBRATION_PROMISE');

export const calibrationSuccess = (calibrationData) => {
  console.log("success", calibrationData);
  return {
    type: CALIBRATION_SUCCESS,
    calibrationData: calibrationData,
  };
};

export const calibrationFail = (error) => {
  return {
    type: CALIBRATION_FAIL,
    error: error,
  };
};
