import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    role: null,         // 'USER' | 'WORKER' | 'ADMIN'
    user: null,         // { phone, name, city, ... }
    isAuthenticated: false,
  },
  reducers: {
    setRole(state, action) {
      state.role = action.payload;
    },
    loginSuccess(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.role = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setRole, loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
