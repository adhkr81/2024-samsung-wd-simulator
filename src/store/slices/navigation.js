import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  drawerOpen: true,
  openCategory: null,
  mode: "",
  model: "smart-tv",
  agent: false,
  version: "2024",
  topic: "",
  subpage: null,
  currentStep: 0,
  selectedHotspot: null,
  possibleRoutes: [[], [], [], []],
  surveyOpen: false
};

export const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setDrawerOpen: (state, action) => {
      state.drawerOpen = action.payload;
    },
    setInitialRoute: (state, action) => {
      state.mode = action.payload.mode;
      state.model = action.payload.model;
      state.topic = action.payload.topic || state.topic;
      state.subpage = action.payload.subpage || state.subpage;
      state.version = action.payload.version;
    },
    setMode: (state, action) => {
      state.mode = action.payload;

      if (action.payload !== "guide" && state.drawerOpen) {
        state.drawerOpen = false;
      } else if (action.payload === "guide" && !state.drawerOpen) {
        state.drawerOpen = true;
      }
    },
    setModel: (state, action) => {
      state.model = action.payload;
    },
    setVersion: (state, action) => {
      state.version = action.payload;
    },
    setTopic: (state, action) => {
      state.topic = action.payload;
    },
    setSubPage: (state, action) => {
      state.subpage = action.payload;
    },
    updateRoute: (state, action) => {
      const newObj = { ...state, ...action.payload };
      return newObj;
    },
    updateOpenCategory: (state, action) => {
      state.openCategory = action.payload;
    },
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    setSelectedHotspot: (state, action) => {
      state.selectedHotspot = action.payload;
    },
    updatePossibleRoutes: (state, action) => {
      // index 0 : topic / overview page / emulator screen
      // index 1 : section
      // index 2 : model slug
      // index 3 : version slug
      state.possibleRoutes[action.payload.index] = action.payload.routes;
    },
    setAgentStatus: (state, action) => {
      state.agent = action.payload;
    },
    setSurveyOpen: (state, action) => {
      state.surveyOpen = action.payload
    }
  },
});

export const {
  setMode,
  setDrawerOpen,
  setModel,
  setTopic,
  setSubPage,
  updateRoute,
  updateOpenCategory,
  setCurrentStep,
  setSelectedHotspot,
  setVersion,
  setInitialRoute,
  setAgentStatus,
  setSurveyOpen
} = navigationSlice.actions;

export default navigationSlice.reducer;
