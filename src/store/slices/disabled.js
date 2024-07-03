import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	drawer: [],
};

export const disableSlice = createSlice({
	name: "disable",
	initialState,
	reducers: {
		addDrawerDisable: (state, action) => {
			if (!state.drawer.includes(action.payload) && action.payload) {
				state.drawer = [...state.drawer, action.payload];
			}
		},
	},
});

export const { addDrawerDisable } = disableSlice.actions;

export default disableSlice.reducer;
