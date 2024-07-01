import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  resourceId: null,
  sid: null,
};

export const agoraSlice = createSlice({
  name: "agora",
  initialState,
  reducers: {
    setResourceId: (state, action) => {
      state.resourceId = action.payload;
    },
    setSid: (state, action) => {
      state.sid = action.payload;
    },
    reset: (state) => {
      state.resourceId = null;
      state.sid = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setResourceId, setSid, reset } = agoraSlice.actions;

export default agoraSlice.reducer;
