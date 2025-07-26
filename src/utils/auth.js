import { logout } from '../../redux/userSlice';
import { clearCart } from '../../redux/cartSlice';
import { clearWishlist } from '../../redux/wishlistSlice';
import { setCart } from '../../redux/cartSlice';

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
    const response = await fetch('http://localhost:5000/api/cart', {
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
    const transformedItems = (data.items || []).map(item => ({
      product: item.product._id || item.product,
      quantity: item.quantity,
      name: item.product.name || 'Unknown Product',
      price: Number(item.product.price) || 0,
      image: item.product.images ? item.product.images[0] : '',
      stock: item.product.stock || 1
    }));
    
    console.log('Transformed cart items:', transformedItems);
    return transformedItems;
  } catch (error) {
    console.error('Error fetching cart:', error);
    return [];
  }
};

export const syncCartWithBackend = async (token, cartItems) => {
  try {
    // The backend expects individual items, so we'll sync each item
    for (const item of cartItems) {
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          product: item.product, 
          quantity: item.quantity 
        })
      });
      
      if (!response.ok) {
        console.error('Failed to sync cart item:', item);
      }
    }
    
    // Return the original items since we're just syncing
    return cartItems;
  } catch (error) {
    console.error('Error syncing cart:', error);
    return cartItems;
  }
};

export const fetchUserWishlist = async (token) => {
  try {
    const response = await fetch('http://localhost:5000/api/wishlist', {
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