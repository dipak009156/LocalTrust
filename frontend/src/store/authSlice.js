import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    role: null,            // 'USER' | 'WORKER' | 'ADMIN'
    phone: null,           // raw phone number
    name: null,            // display name
    user: null,            // full user/worker object
    isAuthenticated: false,
  },
  reducers: {
    setRole(state, action) {
      state.role = action.payload;
    },
    setPhone(state, action) {
      state.phone = action.payload;
    },
    setName(state, action) {
      state.name = action.payload;
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

export const { setRole, setPhone, setName, loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
