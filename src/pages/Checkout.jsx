import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../../redux/cartSlice';

const Checkout = () => {
  const cart = useSelector(state => state.cart.items);
  const user = useSelector(state => state.user.user);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [paying, setPaying] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    fetch('http://localhost:5000/api/address', { headers: { Authorization: `Bearer ${user.token}` } })
      .then(res => res.json())
      .then(data => {
        setAddresses(data);
        setSelectedAddress(data[0]?._id || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    setPaying(true);
    setOrderError(null);
    try {
      const ok = await loadRazorpayScript();
      if (!ok) throw new Error('Failed to load Razorpay');
      // 1. Create Razorpay order
      const res = await fetch('http://localhost:5000/api/orders/razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ amount: subtotal }),
      });
      const data = await res.json();
      if (!res.ok || !data.orderId) throw new Error('Failed to create payment order');
      // 2. Open Razorpay modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_xxxxxxxxxxxx', // Replace with your key or use env
        amount: data.amount,
        currency: data.currency,
        name: "UV's Store",
        description: 'Order Payment',
        order_id: data.orderId,
        handler: async function (response) {
          // 3. Verify payment
          const verifyRes = await fetch('http://localhost:5000/api/orders/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (!verifyRes.ok || !verifyData.success) {
            setOrderError('Payment verification failed.');
            setPaying(false);
            return;
          }
          // 4. Place order
          const addressObj = addresses.find(a => a._id === selectedAddress);
          const items = cart.map(item => ({ product: item.product, quantity: item.quantity, price: item.price, name: item.name, image: item.image }));
          const orderRes = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
            body: JSON.stringify({
              items,
              address: addressObj,
              total: subtotal,
              paymentId: response.razorpay_payment_id,
              paymentStatus: 'paid',
            }),
          });
          if (!orderRes.ok) {
            setOrderError('Order placement failed after payment.');
            setPaying(false);
            return;
          }
          setOrderSuccess(true);
          dispatch(clearCart());
          setPaying(false);
          setTimeout(() => navigate('/orders'), 1500);
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: '#a78bfa' },
        modal: {
          ondismiss: () => setPaying(false),
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setOrderError(err.message || 'Payment failed.');
      setPaying(false);
    }
  };

  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        <h2 style={styles.title}>Checkout</h2>
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Cart Items</h3>
          {cart.length === 0 ? <div style={styles.empty}>Your cart is empty.</div> : (
            <div style={styles.cartList}>
              {cart.map(item => (
                <div key={item.product} style={styles.cartItem}>
                  <img src={item.image} alt={item.name} style={styles.cartImg} />
                  <div style={styles.cartInfo}>
                    <div style={styles.cartName}>{item.name}</div>
                    <div style={styles.cartQty}>Qty: {item.quantity}</div>
                    <div style={styles.cartPrice}>₹{Number(item.price).toLocaleString('en-IN')}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Select Address</h3>
          {loading ? <div>Loading addresses...</div> : addresses.length === 0 ? (
            <div>No addresses found. <button onClick={() => navigate('/address')}>Add Address</button></div>
          ) : (
            <div style={styles.addressList}>
              {addresses.map(addr => (
                <label key={addr._id} style={styles.addressCard}>
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddress === addr._id}
                    onChange={() => setSelectedAddress(addr._id)}
                  />
                  <span>{addr.fullName}, {addr.street}, {addr.city}, {addr.state}, {addr.zip}, {addr.country} - {addr.phone}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Order Summary</h3>
          <div style={styles.summaryRow}><span>Subtotal:</span> <span>₹{Number(subtotal).toLocaleString('en-IN')}</span></div>
          <div style={styles.summaryRow}><span>Shipping:</span> <span>Free</span></div>
          <div style={styles.summaryRow}><span>Total:</span> <span style={{ fontWeight: 700, color: '#18181b' }}>₹{Number(subtotal).toLocaleString('en-IN')}</span></div>
        </div>
        <button
          style={styles.payBtn}
          disabled={!selectedAddress || cart.length === 0 || submitting || paying}
          onClick={handleRazorpayPayment}
        >
          {paying ? 'Processing Payment...' : 'Pay with Razorpay'}
        </button>
        {orderSuccess && <div style={styles.successMsg}>Order placed successfully! Redirecting...</div>}
        {orderError && <div style={styles.errorMsg}>{orderError}</div>}
      </div>
    </div>
  );
};

const styles = {
  bg: { minHeight: '100vh', background: '#f4f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '99vw', overflowX: 'hidden' },
  card: { background: '#fff', borderRadius: 24, boxShadow: '0 2px 16px #e5e7eb', padding: '2.5rem 2rem', minWidth: 340, maxWidth: 500, width: '100%', display: 'flex', flexDirection: 'column', gap: 18 },
  title: { fontSize: '2rem', fontWeight: 700, color: '#a78bfa', margin: 0, textAlign: 'center' },
  section: { marginTop: 12 },
  sectionTitle: { fontSize: '1.1rem', fontWeight: 700, color: '#f472b6', marginBottom: 8 },
  cartList: { display: 'flex', flexDirection: 'column', gap: 10 },
  cartItem: { display: 'flex', alignItems: 'center', gap: 12, background: '#f9f9fb', borderRadius: 10, padding: '0.7rem 1rem' },
  cartImg: { width: 60, height: 60, objectFit: 'cover', borderRadius: 8, background: '#f4f4f6' },
  cartInfo: { display: 'flex', flexDirection: 'column', gap: 2 },
  cartName: { fontWeight: 700, color: '#a78bfa', fontSize: '1rem' },
  cartQty: { color: '#888', fontSize: '0.95rem' },
  cartPrice: { fontWeight: 700, color: 'black', fontSize: '1rem' },
  empty: { color: '#888', fontWeight: 600, textAlign: 'center', margin: '1rem 0' },
  addressList: { display: 'flex', flexDirection: 'column', gap: 10 },
  addressCard: { background: '#f9f9fb', borderRadius: 10, padding: '0.7rem 1rem', display: 'flex', alignItems: 'center', gap: 10, fontWeight: 500, color: '#18181b', cursor: 'pointer' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: '1rem', margin: '4px 0', color: '#18181b' },
  payBtn: { background: 'linear-gradient(90deg, #a78bfa, #f472b6)', color: '#fff', border: 'none', borderRadius: 12, padding: '0.9rem 2rem', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 2px 8px #a78bfa33', transition: 'background 0.2s, transform 0.2s', outline: 'none', marginTop: 18 },
  successMsg: { color: '#10b981', fontWeight: 700, marginTop: 12, textAlign: 'center' },
  errorMsg: { color: '#ff6b6b', fontWeight: 700, marginTop: 12, textAlign: 'center' },
};

export default Checkout; 