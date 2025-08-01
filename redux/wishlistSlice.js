import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;
// Async thunks
export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async (token) => {
  const res = await fetch(`${API_URL}/api/wishlist`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch wishlist');
  const data = await res.json();
  return data.items || [];
});

export const addWishlistItem = createAsyncThunk('wishlist/addWishlistItem', async ({ productId, token }) => {
  const res = await fetch(`${API_URL}/api/wishlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ product: productId }),
  });
  if (!res.ok) throw new Error('Failed to add to wishlist');
  const data = await res.json();
  return data.items || [];
});

export const removeWishlistItem = createAsyncThunk('wishlist/removeWishlistItem', async ({ itemId, token }) => {
  const res = await fetch(`${API_URL}/api/wishlist/${itemId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to remove from wishlist');
  const data = await res.json();
  return data.items || [];
});

export const clearWishlistAsync = createAsyncThunk('wishlist/clearWishlist', async (token) => {
    const res = await fetch(`${API_URL}/api/wishlist`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to clear wishlist');
  const data = await res.json();
  return data.items || [];
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    setWishlist: (state, action) => {
      state.items = action.payload;
    },
    clearWishlist: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchWishlist.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchWishlist.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(addWishlistItem.fulfilled, (state, action) => { state.items = action.payload; })
      .addCase(removeWishlistItem.fulfilled, (state, action) => { state.items = action.payload; })
      .addCase(clearWishlistAsync.fulfilled, (state, action) => { state.items = action.payload; });
  },
});

export const { setWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer; 