import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  recentlyViewedProducts: JSON.parse(localStorage.getItem('recentlyViewedProducts') || '[]'),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('user');
    },
    addRecentlyViewed: (state, action) => {
      const product = action.payload;
      // Remove if already exists
      state.recentlyViewedProducts = state.recentlyViewedProducts.filter(p => p._id !== product._id);
      // Add to front
      state.recentlyViewedProducts.unshift(product);
      // Limit to 10
      if (state.recentlyViewedProducts.length > 10) state.recentlyViewedProducts.pop();
      localStorage.setItem('recentlyViewedProducts', JSON.stringify(state.recentlyViewedProducts));
    },
    clearRecentlyViewed: (state) => {
      state.recentlyViewedProducts = [];
      localStorage.setItem('recentlyViewedProducts', '[]');
    },
  },
});

export const { setUser, logout, addRecentlyViewed, clearRecentlyViewed } = userSlice.actions;
export default userSlice.reducer; 