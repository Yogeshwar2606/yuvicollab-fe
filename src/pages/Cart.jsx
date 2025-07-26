import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateQuantityWithSync, removeFromCartWithSync } from '../utils/cartUtils';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const cartItems = useSelector(state => state.cart.items);
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // You may want to fetch product details for each item if only product IDs are stored
  // For now, assume each item has name, price, image, and product fields

  const total = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        <h2 style={styles.title}>Your Cart</h2>
        {cartItems.length === 0 ? (
          <div style={styles.empty}>Your cart is empty.</div>
        ) : (
          <>
            {cartItems.map(item => (
              <div key={item.product} style={styles.itemRow}>
                <img src={item.image} alt={item.name} style={styles.img} onClick={() => navigate(`/product/${item.product}`)} />
                <div style={styles.info}>
                  <span style={styles.name} onClick={() => navigate(`/product/${item.product}`)}>{item.name}</span>
                  <span style={styles.price}>₹{Number(item.price).toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="number"
                  min={1}
                  max={item.stock || 1}
                  value={item.quantity}
                  onChange={e => updateQuantityWithSync(dispatch, user, { _id: item.product }, Number(e.target.value), item.stock)}
                  style={styles.qty}
                />
                <button style={styles.removeBtn} onClick={() => removeFromCartWithSync(dispatch, user, item.product)}>Remove</button>
              </div>
            ))}
            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Total:</span>
              <span style={styles.totalPrice}>₹{Number(total).toLocaleString('en-IN')}</span>
            </div>
            <button style={styles.checkoutBtn} disabled={cartItems.length === 0} onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </button>
          </>
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 0',
  },
  card: {
    background: '#f9f9fb',
    borderRadius: 24,
    boxShadow: '0 2px 16px #e5e7eb',
    padding: '2.5rem 2rem',
    minWidth: 340,
    maxWidth: 600,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#a78bfa',
    margin: 0,
    marginBottom: 16,
  },
  empty: {
    color: '#888',
    fontWeight: 600,
    textAlign: 'center',
    margin: '2rem 0',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 1px 4px #e5e7eb',
    padding: '0.8rem 1rem',
    marginBottom: 10,
  },
  img: {
    width: 60,
    height: 60,
    objectFit: 'cover',
    borderRadius: 8,
    cursor: 'pointer',
  },
  info: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  name: {
    fontWeight: 700,
    color: '#a78bfa',
    cursor: 'pointer',
    fontSize: '1rem',
    textDecoration: 'underline',
  },
  price: {
    color: '#18181b',
    fontWeight: 600,
    fontSize: '0.95rem',
  },
  qty: {
    width: 50,
    padding: '0.3rem',
    fontSize: '1rem',
    borderRadius: 8,
    border: '1.5px solid #e5e7eb',
    textAlign: 'center',
  },
  removeBtn: {
    background: '#ff6b6b',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '0.4rem 1rem',
    fontWeight: 700,
    fontSize: '0.95rem',
    cursor: 'pointer',
    marginLeft: 8,
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    fontWeight: 700,
    fontSize: '1.1rem',
  },
  totalLabel: {
    color: '#888',
  },
  totalPrice: {
    color: '#a78bfa',
    fontWeight: 800,
    fontSize: '1.2rem',
  },
  checkoutBtn: {
    background: 'linear-gradient(90deg, #a78bfa, #f472b6)',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    padding: '0.75rem 2rem',
    fontWeight: 700,
    fontSize: '1.1rem',
    cursor: 'pointer',
    boxShadow: '0 2px 8px #a78bfa33',
    transition: 'background 0.2s, transform 0.2s',
    outline: 'none',
    marginTop: 18,
  },
};

export default Cart; 