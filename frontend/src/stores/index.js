import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import analysisReducer from "./slices/analysisSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    analysis: analysisReducer,
  },
});
