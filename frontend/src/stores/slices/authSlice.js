import { createSlice } from "@reduxjs/toolkit";

const defaultUser = {
  id: null,
  name: "이채훈",
  email: "chaehoon@example.com",
};

const initialState = {
  isAuthReady: false,
  isLoggedIn: false,
  user: defaultUser,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthReady = true;
      if (!action.payload) {
        state.isLoggedIn = false;
        state.user = defaultUser;
        return;
      }
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthReady = true;
      state.isLoggedIn = false;
      state.user = defaultUser;
    },
    setAuthReady: (state) => {
      state.isAuthReady = true;
    },
  },
});

export const { login, logout, setAuthReady } = authSlice.actions;
export default authSlice.reducer;
