import { addToCart as addToCartAction, removeFromCart as removeFromCartAction, updateQuantity as updateQuantityAction } from '../../redux/cartSlice';
import { syncCartWithBackend } from './auth';

export const addToCartWithSync = (dispatch, user, product, quantity = 1) => {
  // First update Redux state
  dispatch(addToCartAction({ 
    product: product._id, 
    quantity, 
    name: product.name, 
    price: Number(product.price), 
    image: product.images[0], 
    stock: product.stock 
  }));

  // Then sync with backend if user is logged in
  if (user && user.token) {
    // Get current cart state from Redux
    const currentCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    syncCartWithBackend(user.token, currentCart).catch(error => {
      console.error('Failed to sync cart with backend:', error);
    });
  }
};

export const removeFromCartWithSync = (dispatch, user, productId) => {
  // First update Redux state
  dispatch(removeFromCartAction(productId));

  // Then sync with backend if user is logged in
  if (user && user.token) {
    const currentCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    syncCartWithBackend(user.token, currentCart).catch(error => {
      console.error('Failed to sync cart with backend:', error);
    });
  }
};

export const updateQuantityWithSync = (dispatch, user, product, quantity, stock) => {
  // First update Redux state
  dispatch(updateQuantityAction({ product: product._id, quantity, stock }));

  // Then sync with backend if user is logged in
  if (user && user.token) {
    const currentCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    syncCartWithBackend(user.token, currentCart).catch(error => {
      console.error('Failed to sync cart with backend:', error);
    });
  }
}; 