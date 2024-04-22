import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  gps: {
    currentRef: null,
    data: [],
  },
  touch: [],
  accelGyro: [],
  stylus: [],
  eyetracking: {
    isCollecting: false,
    data: [],
  },
};

export const loggerSlice = createSlice({
  name: "logger",
  initialState,
  reducers: {
    setGps: (state, action) => {
      state.gps.data.push(action.payload);
    },
    setGpsRef: (state, action) => {
      state.gps.currentRef = action.payload;
    },
    stopGps: (state, action) => {
      const curRef = state.gps.currentRef;
      if (curRef) {
        navigator.geolocation.clearWatch(curRef);
      }
    },
    setTouch: (state, action) => {
      state.touch.push(action.payload);
    },
    setAccelGyro: (state, action) => {
      state.accelGyro.push(action.payload);
    },
    setStylus: (state, action) => {
      state.stylus.push(action.payload);
    },
    setEyetracking: (state, action) => {
      if (state.eyetracking.isCollecting) {
        state.eyetracking.data.push(action.payload);
      }
    },
    startCollecting: (state, action) => {
      state.eyetracking.isCollecting = true;
    },
    stopCollecting: (state, action) => {
      state.eyetracking.isCollecting = false;
    },

    resetLogger: (state, action) => {
      state.gps.data = [];
      state.gps.currentRef = null;
      state.touch = [];
      state.accelGyro = [];
      state.stylus = [];
      state.eyetracking.data = [];
      state.eyetracking.isCollecting = false;
    },
  },
});

export const {
  setGps,
  setGpsRef,
  stopGps,
  setTouch,
  setKeyboard,
  setAccelGyro,
  setStylus,
  setEyetracking,
  resetLogger,
  startCollecting,
  stopCollecting,
} = loggerSlice.actions;

export default loggerSlice.reducer;
