import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sourceType: "git-upload",
  progress: 65,
  selectedProjectId: "ai-commit-analyzer",
};

const analysisSlice = createSlice({
  name: "analysis",
  initialState,
  reducers: {
    setSourceType: (state, action) => {
      state.sourceType = action.payload;
    },
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
    selectProject: (state, action) => {
      state.selectedProjectId = action.payload;
    },
  },
});

export const { setSourceType, setProgress, selectProject } = analysisSlice.actions;
export default analysisSlice.reducer;
