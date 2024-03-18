import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  uid: "",
  name: "",
  call: false,
};

export const channelSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {
    onChaneUid: (state, action) => {
      state.uid = action.payload;
    },
    onChangeChannelName: (state, action) => {
      state.name = action.payload;
    },
    setCall: (state) => {
      state.call = true;
    },
    unSetCall: (state) => {
      state.call = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { onChaneUid, onChangeChannelName, setCall, unSetCall } =
  channelSlice.actions;

export default channelSlice.reducer;
