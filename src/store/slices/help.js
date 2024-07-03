import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  active: false,
  current: 1,
};

export const helpSlice = createSlice({
  name: "help",
  initialState,
  reducers: {
    setHelpActive: (state) => {
      state.active = !state.active;
      state.current = 1;
    },
    setHelpCurrent: (state, action) => {
      state.current = action.payload;
    },
    resetHelp: (state) => {
      state.active = false;
      state.current = 1;
    },
    gotoNextStep: (state) => {
      state.current = state.current + 1;
    },
  },
});

export const { setHelpActive, setHelpCurrent, gotoNextStep, resetHelp } = helpSlice.actions;

export default helpSlice.reducer;
