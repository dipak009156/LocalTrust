import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    role: localStorage.getItem('role') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
  },
  reducers: {
    setRole(state, action) {
      state.role = action.payload;
      localStorage.setItem('role', action.payload);
    },
    loginSuccess(state, action) {
      const { user, token, role } = action.payload;
      state.user = user;
      state.token = token;
      state.role = role || state.role;
      state.isAuthenticated = true;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      if (role) localStorage.setItem('role', role);
    },
    logout(state) {
      state.role = null;
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.clear();
    },
  },
});

export const { setRole, loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
