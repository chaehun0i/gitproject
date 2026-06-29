import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthReady: false,
  isLoggedIn: false,
  user: {
    name: "이채훈",
    email: "chaehoon@example.com",
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthReady = true;
      state.isLoggedIn = true;
      state.user = action.payload ?? state.user;
    },
    logout: (state) => {
      state.isAuthReady = true;
      state.isLoggedIn = false;
    },
    setAuthReady: (state) => {
      state.isAuthReady = true;
    },
  },
});

export const { login, logout, setAuthReady } = authSlice.actions;
export default authSlice.reducer;
