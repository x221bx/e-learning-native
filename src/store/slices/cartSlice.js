import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [], // [{ id, title, teacher, price, qty }]
};

function findIndexById(items, id) {
    return items.findIndex((it) => it.id === id);
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            const item = action.payload || {};
            const id = item.id;
            if (!id) return;
            const idx = findIndexById(state.items, id);
            if (idx >= 0) {
                state.items[idx].qty = (state.items[idx].qty || 1) + (item.qty || 1);
            } else {
                state.items.push({ ...item, qty: item.qty || 1, price: item.price ?? 0 });
            }
        },
        removeFromCart(state, action) {
            const id = action.payload;
            state.items = state.items.filter((it) => it.id !== id);
        },
        updateQty(state, action) {
            const { id, qty } = action.payload || {};
            const idx = findIndexById(state.items, id);
            if (idx >= 0) state.items[idx].qty = Math.max(1, parseInt(qty || 1, 10));
        },
        clearCart(state) {
            state.items = [];
        },
    },
});

export const { addToCart, removeFromCart, updateQty, clearCart } = cartSlice.actions;

export const selectCartCount = (state) => state.cart.items.reduce((n, it) => n + (it.qty || 1), 0);
export const selectCartDistinctCount = (state) => state.cart.items.length;
export const selectCartTotal = (state) => state.cart.items.reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0);

export default cartSlice.reducer;


