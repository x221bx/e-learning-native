import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CoursesAPI } from '../../services/api';

export const loadCourses = createAsyncThunk('courses/load', async () => {
  try {
    const res = await CoursesAPI.list({ offset: 0, limit: 10 });
    return res.items || [];
  } catch (e) {
    return [];
  }
});

const slice = createSlice({
  name: 'courses',
  initialState: { list: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadCourses.fulfilled, (state, action) => {
      state.list = action.payload || [];
    });
  },
});

export default slice.reducer;

