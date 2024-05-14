import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  websiteSetup: null,
};

export const websiteSetup = createSlice({
  name: "website-setup",
  initialState,
  reducers: {
    setupAction: (state, payload) => {
      state.websiteSetup = payload;
    },
  },
});
export const { setupAction } = websiteSetup.actions;
export default websiteSetup.reducer;
