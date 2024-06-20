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
  },
});

// Action creators are generated for each case reducer function
export const { setResourceId, setSid } = agoraSlice.actions;

export default agoraSlice.reducer;
