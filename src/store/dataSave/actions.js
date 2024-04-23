import { SAVE_GPS_DATA, DELETE_GPS_DATA, CLEAR_GPS_DATA, SAVE_TOUCH_DATA, DELETE_TOUCH_DATA, CLEAR_TOUCH_DATA, SAVE_KEYBOARD_DATA, DELETE_KEYBOARD_DATA, CLEAR_KEYBOARD_DATA, SAVE_STYLUS_DATA, DELETE_STYLUS_DATA, CLEAR_STYLUS_DATA, SAVE_ACCELGYRO_DATA, DELETE_ACCELGYRO_DATA, CLEAR_ACCELGYRO_DATA, SAVE_EYETRACKING_DATA, DELETE_EYETRACKING_DATA, CLEAR_EYETRACKING_DATA } from './actionTypes';

export const saveGpsData = gpsData => ({
  type: SAVE_GPS_DATA,
  payload: gpsData,
});

export const deleteGpsData = ({ startTime, endTime }) => ({
  type: DELETE_GPS_DATA,
  payload: { startTime, endTime },
});

export const clearGpsData = () => ({
  type: CLEAR_GPS_DATA,
});

export const saveTouchData = touchData => ({
  type: SAVE_TOUCH_DATA,
  payload: touchData,
});

export const deleteTouchData = ({ startTime, endTime }) => ({
  type: DELETE_TOUCH_DATA,
  payload: { startTime, endTime },
});

export const clearTouchData = () => ({
  type: CLEAR_TOUCH_DATA,
});

export const saveKeyboardData = keyboardData => ({
  type: SAVE_KEYBOARD_DATA,
  payload: keyboardData,
});

export const deleteKeyboardData = ({ startTime, endTime }) => ({
  type: DELETE_KEYBOARD_DATA,
  payload: { startTime, endTime },
});

export const clearKeyboardData = () => ({
  type: CLEAR_KEYBOARD_DATA,
});

export const saveStylusData = stylusData => ({
  type: SAVE_STYLUS_DATA,
  payload: stylusData,
});

export const deleteStylusData = ({ startTime, endTime }) => ({
  type: DELETE_STYLUS_DATA,
  payload: { startTime, endTime },
});

export const clearStylusData = () => ({
  type: CLEAR_STYLUS_DATA,
});

export const saveAccelgyroData = accelgyroData => ({
  type: SAVE_ACCELGYRO_DATA,
  payload: accelgyroData,
});

export const deleteAccelgyroData = ({ startTime, endTime }) => ({
  type: DELETE_ACCELGYRO_DATA,
  payload: { startTime, endTime },
});


export const clearAccelgyroData = () => ({
  type: CLEAR_ACCELGYRO_DATA,
});

export const saveEyetrackingData = eyetrakingData => ({
  type: SAVE_EYETRACKING_DATA,
  payload: eyetrakingData,
});

export const deleteEyetrackingData = ({ startTime, endTime }) => ({
  type: DELETE_EYETRACKING_DATA,
  payload: { startTime, endTime },
});

export const clearEyetrackingData = () => ({
  type: CLEAR_EYETRACKING_DATA,
});