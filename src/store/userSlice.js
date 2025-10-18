import { createSlice } from '@reduxjs/toolkit';

// Basic user/auth state for local (mock) auth
// Persist/restore in components (e.g., App.js) via AsyncStorage
const initialState = {
  user: null,           // { id, name, email, avatar, role }
  isAuthenticated: false,
  isGuest: false,
  isAdmin: false,
  enrolled: [], // list of course IDs
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      const user = action.payload || null;
      state.user = user;
      state.isAuthenticated = !!user;
      state.isGuest = false;
      state.isAdmin = Boolean(user?.role === 'admin' || user?.role === 'teacher');
    },
    registerSuccess(state, action) {
      const user = action.payload || null;
      state.user = user;
      state.isAuthenticated = !!user;
      state.isGuest = false;
      state.isAdmin = Boolean(user?.role === 'admin' || user?.role === 'teacher');
    },
    continueAsGuest(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.isGuest = true;
      state.isAdmin = false;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.isGuest = false;
      state.isAdmin = false;
      state.enrolled = [];
    },

    setAdmin(state, action) {
      state.isAdmin = Boolean(action.payload);
    },
    updateProfile(state, action) {
      const updates = action.payload || {};
      state.user = { ...state.user, ...updates };
      if (updates?.role) state.isAdmin = Boolean(updates.role === 'admin' || updates.role === 'teacher');
    },

    // Load persisted enrolled courses on app start
    loadEnrolledCourses(state, action) {
      const enrolled = action.payload || [];
      state.enrolled = enrolled;
    },

    joinCourse(state, action) {
      const id = action.payload;
      if (!state.enrolled.includes(id)) state.enrolled.push(id);
    },
    unjoinCourse(state, action) {
      const id = action.payload;
      state.enrolled = state.enrolled.filter((x) => x !== id);
    },
    enrollInCourse(state, action) {
      const id = action.payload;
      if (!state.enrolled.includes(id)) state.enrolled.push(id);
    },
    clearEnrollments(state) {
      state.enrolled = [];
    },
  },
});

export const {
  loginSuccess,
  registerSuccess,
  continueAsGuest,
  logout,
  setAdmin,
  updateProfile,
  joinCourse,
  unjoinCourse,
  enrollInCourse,
  loadEnrolledCourses,
  clearEnrollments
} = userSlice.actions;

export default userSlice.reducer;
