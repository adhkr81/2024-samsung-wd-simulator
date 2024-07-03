import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  doc: null,
  assetsPath: null,
};

export const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setIntialData: (state, action) => {
      console.log(action.payload);
      state.doc = action.payload;
    },
    updateTopics: (state, action) => {
      state.doc.guide[action.payload.model][action.payload.version].topic = {
        ...state.doc.guide[action.payload.model][action.payload.version],
        ...action.payload.topics,
      };
    },
    setAssetsPath: (state, action) => {
      state.assetsPath = action.payload;
    },
  },
});

export const { setLoading, setIntialData, updateTopics, setAssetsPath } =
  dataSlice.actions;

export default dataSlice.reducer;
