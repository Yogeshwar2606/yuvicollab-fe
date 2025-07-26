import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchWishlist, removeWishlistItem } from '../../redux/wishlistSlice';
import { Heart, Trash2 } from 'lucide-react';

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.user.user);
  const { items, loading, error } = useSelector(state => state.wishlist);

  useEffect(() => {
    if (user) {
      dispatch(fetchWishlist(user.token));
    }
  }, [dispatch, user]);

  const handleRemove = (itemId) => {
    if (user) dispatch(removeWishlistItem({ itemId, token: user.token }));
  };

  if (!user) return <div style={styles.center}>Please log in to view your wishlist.</div>;

  return (
    <div style={styles.bg}>
      <div style={styles.container}>
        <h1 style={styles.title}><Heart size={28} style={{ color: '#f472b6', marginRight: 10 }} />Your Wishlist</h1>
        {loading ? (
          <div style={styles.center}>Loading wishlist...</div>
        ) : error ? (
          <div style={styles.error}>{error}</div>
        ) : items.length === 0 ? (
          <div style={styles.center}>Your wishlist is empty.</div>
        ) : (
          <div style={styles.grid}>
            {items.map(item => (
              <div key={item._id} style={styles.card}>
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  style={styles.img}
                  onClick={() => navigate(`/product/${item.product._id}`)}
                />
                <div style={styles.info}>
                  <span
                    style={styles.name}
                    onClick={() => navigate(`/product/${item.product._id}`)}
                  >
                    {item.product.name}
                  </span>
                  <span style={styles.price}>₹{Number(item.product.price).toLocaleString('en-IN')}</span>
                </div>
                <button style={styles.removeBtn} onClick={() => handleRemove(item._id)} aria-label="Remove from wishlist">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  bg: {
    minHeight: '100vh',
    background: '#fff',
    fontFamily: 'Montserrat, sans-serif',
    padding: '2rem 0',
    width: '99vw',
    overflowX: 'hidden',
  },
  container: {
    maxWidth: 900,
    margin: '0 auto',
    background: '#f9f9fb',
    borderRadius: 24,
    boxShadow: '0 2px 16px #e5e7eb',
    padding: 32,
    width: '100%',
    boxSizing: 'border-box',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 800,
    color: '#a78bfa',
    marginBottom: 24,
    display: 'flex',
    alignItems: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 24,
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 2px 8px #e5e7eb',
    padding: 18,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    minHeight: 260,
  },
  img: {
    width: 120,
    height: 120,
    objectFit: 'cover',
    borderRadius: 12,
    marginBottom: 12,
    cursor: 'pointer',
    background: '#f4f4f6',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  name: {
    fontWeight: 700,
    fontSize: '1.1rem',
    color: '#a78bfa',
    cursor: 'pointer',
    marginBottom: 2,
  },
  price: {
    color: '#18181b',
    fontWeight: 600,
    fontSize: '1rem',
  },
  removeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    background: 'rgba(255,255,255,0.8)',
    border: 'none',
    borderRadius: '50%',
    padding: 6,
    cursor: 'pointer',
    zIndex: 2,
    boxShadow: '0 2px 8px #f472b622',
    transition: 'background 0.2s, color 0.2s',
    outline: 'none',
  },
  center: {
    textAlign: 'center',
    color: '#a78bfa',
    fontWeight: 700,
    fontSize: '1.2rem',
    margin: '2rem 0',
    background: '#fff',
  },
  error: {
    textAlign: 'center',
    color: '#ff6b6b',
    fontWeight: 700,
    fontSize: '1.2rem',
    margin: '2rem 0',
    background: '#fff',
  },
};

export default Wishlist; 