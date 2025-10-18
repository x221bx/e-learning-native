import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadWishlist = createAsyncThunk('wishlist/load', async (userId) => {
  try {
    const key = `@elearning_wishlist_${userId || 'guest'}`;
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
});

// Removed side-effects from reducers. Persistence is handled by thunks below.

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: [] },
  reducers: {
    setWishlist(state, action) {
      state.items = action.payload || [];
    },
    // Pure reducers (no I/O)
    addToWishlistLocal(state, action) {
      const { id } = action.payload || {};
      if (id && !state.items.includes(id)) {
        state.items.push(id);
      }
    },
    removeFromWishlistLocal(state, action) {
      const { id } = action.payload || {};
      if (id) {
        state.items = state.items.filter((x) => x !== id);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadWishlist.fulfilled, (state, action) => {
      state.items = Array.isArray(action.payload) ? action.payload : [];
    });
  },
});

export const { setWishlist, addToWishlistLocal, removeFromWishlistLocal } = wishlistSlice.actions;

// Thunks that keep reducers pure and persist to AsyncStorage
export const addToWishlist = (payload) => async (dispatch, getState) => {
  dispatch(addToWishlistLocal(payload));
  try {
    const userId = payload?.userId;
    const key = `@elearning_wishlist_${userId || 'guest'}`;
    const { items } = getState().wishlist;
    await AsyncStorage.setItem(key, JSON.stringify(items));
  } catch (e) {
    if (__DEV__) console.warn('Failed to persist wishlist (add):', e);
  }
};

export const removeFromWishlist = (payload) => async (dispatch, getState) => {
  dispatch(removeFromWishlistLocal(payload));
  try {
    const userId = payload?.userId;
    const key = `@elearning_wishlist_${userId || 'guest'}`;
    const { items } = getState().wishlist;
    await AsyncStorage.setItem(key, JSON.stringify(items));
  } catch (e) {
    if (__DEV__) console.warn('Failed to persist wishlist (remove):', e);
  }
};

export default wishlistSlice.reducer;
