import { createSlice } from '@reduxjs/toolkit';

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    ids: [],
  },
  reducers: {
    addFavorite(state, action) {
      const id = action.payload;
      if (!state.ids.includes(id)) state.ids.push(id);
    },
    removeFavorite(state, action) {
      const id = action.payload;
      state.ids = state.ids.filter((x) => x !== id);
    },
    toggleFavorite(state, action) {
      const id = action.payload;
      if (state.ids.includes(id)) {
        state.ids = state.ids.filter((x) => x !== id);
      } else {
        state.ids.push(id);
      }
    },
    clearFavorites(state) {
      state.ids = [];
    },
  },
});

export const { addFavorite, removeFavorite, toggleFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;

