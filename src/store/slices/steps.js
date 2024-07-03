import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	current: 0,
};

export const stepsSlice = createSlice({
	name: "steps",
	initialState,
	reducers: {
		incrementStep: (state) => {
			state.current += 1;
		},
		decrementStep: (state) => {
			state.current -= 1;
		},
		setStepCurrent: (state, action) => {
			state.current = action.payload;
		},
		resetStepCurrent: (state) => {
			state.current = 0;
		},
	},
});

export const { incrementStep, decrementStep, setStepCurrent, resetStepCurrent } = stepsSlice.actions;

export default stepsSlice.reducer;
