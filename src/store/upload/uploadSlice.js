import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modal: false,
  status: {
    UPLOAD_WAIT: true,
    UPLOAD_SUCCESS: false,
    UPLOAD_ERROR: false,
  },
};

export const uploadSlice = createSlice({
  name: "logger",
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.modal = true;
    },
    closeModal: (state, action) => {
      state.modal = false;
    },

    uploadSuccess: (state, action) => {
      state.status.UPLOAD_SUCCESS = true;
      state.status.UPLOAD_ERROR = false;
    },
    startUpload: (state, action) => {
      state.status.WAIT = false;
    },
    uploadError: (state, action) => {
      state.status.UPLOAD_SUCCESS = false;
      state.status.UPLOAD_ERROR = true;
    },
    resetUpload: (state, action) => {
      state.modal = initialState.modal;
      state.status = { ...initialState.status };
    },
  },
});

export const {
  openModal,
  closeModal,
  startUpload,
  uploadSuccess,
  uploadError,
  resetUpload,
} = uploadSlice.actions;

export default uploadSlice.reducer;
