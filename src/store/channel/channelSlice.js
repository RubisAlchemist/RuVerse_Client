import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  uid: {
    value: "",
    isError: false,
  },
  name: {
    value: "",
    isError: false,
  },
  call: false,
};

export const channelSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {
    onChangeUid: (state, action) => {
      const { value, valid } = action.payload;
      state.uid.value = value;
      if (valid) {
        state.uid.isError = false;
      } else {
        state.uid.isError = true;
      }
    },
    onChangeChannelName: (state, action) => {
      const { value, valid } = action.payload;
      state.name.value = value;
      if (valid) {
        state.name.isError = false;
      } else {
        state.name.isError = true;
      }
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
export const { onChangeUid, onChangeChannelName, setCall, unSetCall } =
  channelSlice.actions;

export default channelSlice.reducer;
