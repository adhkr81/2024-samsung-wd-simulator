import { configureStore, isRejectedWithValue } from "@reduxjs/toolkit";

import dataReducer from "./slices/data";
import helpReducer from "./slices/help";
import stepsReducer from "./slices/steps";
import navigationReducer from "./slices/navigation";
import disableReducer from "./slices/disabled";

const nonSerializableErrorCatcher = (api) => (next) => (action) => {
	if (isRejectedWithValue(action.payload)) {
		console.warn("We got a rejected action!");
	}

	return next(action);
};
export const store = configureStore({
	reducer: {
		data: dataReducer,
		help: helpReducer,
		steps: stepsReducer,
		navigation: navigationReducer,
		disable: disableReducer,
	},
	middleware: [nonSerializableErrorCatcher],
});
