import React from 'react';
import { ShoppingCart, User, Heart, LogOut } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { handleLogout } from '../src/utils/auth';

const Navbar = () => {
  const cartCount = useSelector(state => state.cart.items.reduce((sum, item) => sum + item.quantity, 0));
  const wishlistCount = useSelector(state => state.wishlist.items.length);
  const user = useSelector(state => state.user.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <nav style={styles.navBg}>
      <div style={styles.navContent}>
        <div style={styles.brand} onClick={() => navigate('/home')}>
          <span style={styles.logo}>UV</span>
          <span style={styles.title}>UV's Store</span>
        </div>
        <div style={styles.icons}>
          <button style={styles.iconBtn} onClick={() => navigate('/wishlist')}>
            <Heart size={26} />
            {wishlistCount > 0 && <span style={styles.cartBadge}>{wishlistCount}</span>}
          </button>
          <button style={styles.iconBtn} onClick={() => navigate('/cart')}>
            <ShoppingCart size={26} />
            {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
          </button>
          <button style={styles.iconBtn} onClick={() => navigate('/profile')}>
            <User size={26} />
          </button>
          {user && (
            <button 
              style={styles.iconBtn} 
              onClick={() => handleLogout(dispatch, navigate)}
              title="Logout"
            >
              <LogOut size={26} />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navBg: {
    width: '100vw',
    background: '#fff',
    boxShadow: '0 2px 12px #e5e7eb',
    position: 'sticky',
    top: 0,
    left: 0,
    zIndex: 100,
    padding: 0,
    margin: 0,
    overflowX: 'hidden',
  },
  navContent: {
    maxWidth: 1200,
    width: '100%',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem 2vw',
    boxSizing: 'border-box',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    gap: 10,
  },
  logo: {
    background: 'linear-gradient(90deg, #a78bfa, #f472b6)',
    color: '#fff',
    fontWeight: 900,
    fontSize: 22,
    borderRadius: 8,
    padding: '2px 10px',
    marginRight: 6,
    letterSpacing: 1,
  },
  title: {
    fontWeight: 700,
    fontSize: 20,
    color: '#a78bfa',
    letterSpacing: 1,
  },
  icons: {
    display: 'flex',
    alignItems: 'center',
    gap: 18,
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    color: '#a78bfa',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    background: '#f472b6',
    color: '#fff',
    borderRadius: '50%',
    fontSize: 12,
    fontWeight: 700,
    padding: '2px 7px',
    minWidth: 22,
    textAlign: 'center',
    boxShadow: '0 2px 8px #f472b633',
  },
};

export default Navbar; 