import { createSlice, configureStore } from "@reduxjs/toolkit"
import { Provider } from 'react-redux';
import React from 'react';

// Import other slices
import coursesReducer from './slices/coursesSlice';
import wishlistReducer from './slices/wishlistSlice';
import favoritesReducer from './favoritesSlice';
import userReducer from './userSlice';
import uiReducer from './uiSlice';

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: []
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload
      const existingItem = state.items.find((i) => i.id === item.id)
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.items.push({ ...item, quantity: 1 })
      }
    },
    removeFromCart: (state, action) => {
      const itemId = action.payload
      state.items = state.items.filter((i) => i.id !== itemId)
    },
    clearCart: (state) => {
      state.items = []
    },
  },
})

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions

const store = configureStore({
  reducer: {
    courses: coursesReducer,
    wishlist: wishlistReducer,
    favorites: favoritesReducer,
    user: userReducer,
    ui: uiReducer,
    cart: cartSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(),
})

// HOC to wrap App with Redux Provider
export function withStore(Component) {
  return function StoreWrapper(props) {
    return (
      <Provider store={store}>
        <Component {...props} />
      </Provider>
    );
  };
}

export default store