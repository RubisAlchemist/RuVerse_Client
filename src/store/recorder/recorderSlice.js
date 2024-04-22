import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  recorder: {},
  upload: {
    video: null,
    screen: null,
    UPLOAD_SUCCESS: false,
    UPLOAD_ERROR: false,
  },
};

export const recorderSlice = createSlice({
  name: "logger",
  initialState,
  reducers: {
    startRecording: (state, action) => {
      state.isRecording = true;
    },

    stopRecording: (state, action) => {
      state.isRecording = false;
    },
  },
});

export const { startRecording, stopRecording } = recorderSlice.actions;

export default recorderSlice.reducer;
