import { logout } from '../../redux/userSlice';
import { clearCart } from '../../redux/cartSlice';
import { clearWishlist } from '../../redux/wishlistSlice';
import { setCart } from '../../redux/cartSlice';
const API_URL = import.meta.env.VITE_API_URL;
export const handleLogout = (dispatch, navigate) => {
  // Clear all user-related state
  dispatch(logout());
  dispatch(clearCart());
  dispatch(clearWishlist());
  
  // Navigate to landing page
  if (navigate) {
    navigate('/');
  } else {
    window.location.href = '/';
  }
};

export const fetchUserCart = async (token) => {
  try {
    const response = await fetch(`${API_URL}/api/cart`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch cart');
    }
    
    const data = await response.json();
    console.log('Fetched cart data:', data);
    
    // Transform backend cart items to frontend format
    const transformedItems = (data.items || []).map(item => {
      // Ensure we have the product data
      if (!item.product) {
        console.warn('Cart item missing product data:', item);
        return null;
      }

      return {
        product: item.product._id || item.product,
        quantity: item.quantity || 1,
        name: item.product.name || 'Unknown Product',
        price: Number(item.product.price) || 0,
        image: item.product.images && item.product.images.length > 0 ? item.product.images[0] : '',
        stock: typeof item.product.stock === 'number' ? item.product.stock : 1
      };
    }).filter(Boolean); // Remove any null items
    
    console.log('Transformed cart items:', transformedItems);
    return transformedItems;
  } catch (error) {
    console.error('Error fetching cart:', error);
    return [];
  }
};

export const syncCartWithBackend = async (token, cartItems) => {
  try {
    console.log('Syncing cart items:', cartItems);
    
    // First, clear the existing cart on the backend
    const clearResponse = await fetch(`${API_URL}/api/cart`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!clearResponse.ok) {
      throw new Error('Failed to clear cart');
    }

    // Then add all current items
    if (cartItems.length > 0) {
      const items = cartItems.map(item => ({
        product: typeof item.product === 'string' ? item.product : item.product._id,
        quantity: item.quantity
      }));
      
      console.log('Sending bulk update with items:', items);
      
      const response = await fetch(`${API_URL}/api/cart/bulk`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to sync cart items');
      }
      
      const result = await response.json();
      console.log('Bulk update response:', result);
    }
    
    return cartItems;
  } catch (error) {
    console.error('Error syncing cart:', error);
    return cartItems;
  }
};

export const fetchUserWishlist = async (token) => {
  try {
    const response = await fetch(`${API_URL}/api/wishlist`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch wishlist');
    }
    
    const data = await response.json();
    console.log('Fetched wishlist data:', data);
    
    // Transform backend wishlist items to frontend format
    const transformedItems = (data.items || []).map(item => ({
      _id: item._id,
      product: item.product._id || item.product,
      name: item.product.name || 'Unknown Product',
      price: Number(item.product.price) || 0,
      image: item.product.images ? item.product.images[0] : '',
      category: item.product.category || 'Unknown',
      stock: item.product.stock || 0
    }));
    
    console.log('Transformed wishlist items:', transformedItems);
    return transformedItems;
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return [];
  }
}; 