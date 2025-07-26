import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: JSON.parse(localStorage.getItem('cartItems') || '[]'),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const exist = state.items.find(i => i.product === item.product);
      if (exist) {
        // Clamp to stock
        exist.quantity = Math.min(exist.quantity + item.quantity, item.stock || exist.stock || 1);
        exist.stock = item.stock || exist.stock || 1;
      } else {
        state.items.push({ ...item, stock: item.stock });
      }
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i.product !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { product, quantity, stock } = action.payload;
      const item = state.items.find(i => i.product === product);
      if (item) {
        const maxStock = stock || item.stock || 1;
        item.quantity = Math.max(1, Math.min(quantity, maxStock));
      }
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.setItem('cartItems', '[]');
    },
    setCart: (state, action) => {
      state.items = action.payload;
      localStorage.setItem('cartItems', JSON.stringify(action.payload));
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer; 