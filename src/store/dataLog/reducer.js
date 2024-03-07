// reducers.js
const initialState = {
    gpsData: [],
    accelgyroData: [],
    sessionTouchData: [],
    sessionKeyboardData: [],
    sessionStylusData: [],
    eyetrackingData: [],
  };
  
  const dataReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'UPDATE_DATA':
        return {
          // ...state,
          // ...action.payload,
          ...state,
          gpsData: [...state.gpsData, ...action.payload.gpsData],
          accelgyroData: [...state.accelgyroData, ...action.payload.accelgyroData],
          sessionTouchData: [...state.sessionTouchData, ...action.payload.sessionTouchData],
          sessionKeyboardData: [...state.sessionKeyboardData, ...action.payload.sessionKeyboardData],
          sessionStylusData: [...state.sessionStylusData, ...action.payload.sessionStylusData],
          eyetrackingData: [...state.eyetrackingData, ...action.payload.eyetrackingData],
        };
      default:
        return state;
    }
  };
  
  export default dataReducer;