import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isAdmin: false,
    enrolled: [], // list of course IDs
  },
  reducers: {
    setAdmin(state, action) {
      state.isAdmin = Boolean(action.payload);
    },
    joinCourse(state, action) {
      const id = action.payload;
      if (!state.enrolled.includes(id)) state.enrolled.push(id);
    },
    unjoinCourse(state, action) {
      const id = action.payload;
      state.enrolled = state.enrolled.filter((x) => x !== id);
    },
    clearEnrollments(state) {
      state.enrolled = [];
    },
  },
});

export const { setAdmin, joinCourse, unjoinCourse, clearEnrollments } = userSlice.actions;
export default userSlice.reducer;

