import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../redux/userSlice';
import { handleLogout } from '../utils/auth';
import { Pencil, Star, MapPin, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(true);
  const [allAddresses, setAllAddresses] = useState([]);
  const [orderStats, setOrderStats] = useState({ total: 0, pending: 0, delivered: 0, shipped: 0, paid: 0 });
  const [orderStatsLoading, setOrderStatsLoading] = useState(true);
  const recentlyViewed = useSelector(state => state.user.recentlyViewedProducts);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    // Sync local state with user data
    setName(user.name || '');
    setEmail(user.email || '');
    setPhone(user.phone || '');
    
    // Fetch addresses
    setAddressLoading(true);
    fetch('http://localhost:5000/api/address', { headers: { Authorization: `Bearer ${user.token}` } })
      .then(res => res.json())
      .then(data => {
        const def = data.find(a => a.isDefault);
        setDefaultAddress(def || null);
        setAllAddresses(data);
        setAddressLoading(false);
      })
      .catch(() => setAddressLoading(false));

    // Fetch order statistics
    setOrderStatsLoading(true);
    fetch('http://localhost:5000/api/orders', { headers: { Authorization: `Bearer ${user.token}` } })
      .then(res => res.json())
      .then(data => {
        const total = data.length;
        const pending = data.filter(order => order.status === 'pending').length;
        const delivered = data.filter(order => order.status === 'delivered').length;
        const shipped = data.filter(order => order.status === 'shipped').length;
        const paid = data.filter(order => order.status === 'paid').length;
        setOrderStats({ total, pending, delivered, shipped, paid });
        setOrderStatsLoading(false);
      })
      .catch(() => setOrderStatsLoading(false));
  }, [user]);

  if (!user) return <div style={styles.loading}>Loading profile...</div>;

  const handleEdit = () => {
    setEditing(true);
    setSuccess(false);
    setError(null);
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    console.log('Saving profile with data:', { name, email, phone });
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ name, email, phone })
      });
      
      const data = await res.json();
      console.log('Server response:', data);
      
      if (!res.ok) throw new Error(data.message || 'Failed to update profile');
      
      // Update Redux state with new user data
      const updatedUser = { ...user, ...data };
      console.log('Updated user data:', updatedUser);
      dispatch(setUser(updatedUser));
      setSuccess(true);
      setEditing(false);
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.bg}>
      <div style={styles.container}>
        {/* Left Section - Profile */}
        <div style={styles.profileSection}>
          <div style={styles.profileCard}>
            <div style={styles.header}>
              <h2 style={styles.title}>Profile</h2>
              <button style={styles.editBtn} onClick={handleEdit} disabled={editing}>
                <Pencil size={20} />
              </button>
            </div>
            <div style={styles.form}>
              <label style={styles.label}>Name:</label>
              {editing ? (
                <input style={styles.input} value={name} onChange={e => setName(e.target.value)} disabled={loading} required />
              ) : (
                <div style={styles.value}>{user.name}</div>
              )}
              <label style={styles.label}>Email:</label>
              {editing ? (
                <input style={styles.input} value={email} onChange={e => setEmail(e.target.value)} disabled={loading} required />
              ) : (
                <div style={styles.value}>{user.email}</div>
              )}
              <label style={styles.label}>Phone:</label>
              {editing ? (
                <input style={styles.input} value={phone} onChange={e => setPhone(e.target.value)} disabled={loading} required />
              ) : (
                <div style={styles.value}>{user.phone}</div>
              )}
              {editing && (
                <button style={styles.saveBtn} onClick={handleSave} disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </button>
              )}
              {error && <div style={styles.error}>{error}</div>}
              {success && <div style={styles.success}>Profile updated!</div>}
            </div>
            <div style={styles.sectionDivider} />
            <div style={styles.logoutSection}>
              <button 
                style={styles.logoutBtn} 
                onClick={() => handleLogout(dispatch, navigate)}
              >
                Logout
              </button>
            </div>
            <div style={styles.sectionDivider} />
            <div style={styles.addressSection}>
              <div style={styles.addressHeader}>
                <h3 style={styles.addressTitle}>Addresses</h3>
                <button style={styles.addressBtn} onClick={() => navigate('/address')}>Manage Addresses</button>
              </div>
              <div style={styles.addressHint}>Add, edit, or delete your delivery addresses.</div>
              {addressLoading ? (
                <div style={styles.addressLoading}>Loading addresses...</div>
              ) : allAddresses.length === 0 ? (
                <div style={styles.addressHint}>No addresses found.</div>
              ) : (
                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {allAddresses.map(addr => (
                    <div key={addr._id} style={styles.otherAddressCard}>
                      <div style={styles.defaultName}>{addr.fullName}</div>
                      <div style={styles.defaultLine}><MapPin size={16} style={{ marginRight: 6, color: '#a78bfa' }} />{addr.street}, {addr.city}, {addr.state}, {addr.zip}, {addr.country}</div>
                      <div style={styles.defaultLine}><Phone size={16} style={{ marginRight: 6, color: '#a78bfa' }} />{addr.phone}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Orders and Recently Viewed */}
        <div style={styles.rightSection}>
          {/* Top-Right Section - My Orders */}
          <div style={styles.ordersSection}>
            <div style={styles.ordersCard}>
              <h3 style={styles.sectionTitle}>My Orders</h3>
              <div style={styles.ordersContent}>
                <div style={styles.orderStats}>
                  <div style={styles.statItem}>
                    <div style={styles.statNumber}>
                      {orderStatsLoading ? '...' : orderStats.total}
                    </div>
                    <div style={styles.statLabel}>Total Orders</div>
                  </div>
                  <div style={styles.statItem}>
                    <div style={styles.statNumber}>
                      {orderStatsLoading ? '...' : orderStats.pending}
                    </div>
                    <div style={styles.statLabel}>Pending</div>
                  </div>
                  <div style={styles.statItem}>
                    <div style={styles.statNumber}>
                      {orderStatsLoading ? '...' : orderStats.delivered}
                    </div>
                    <div style={styles.statLabel}>Delivered</div>
                  </div>
                  <div style={styles.statItem}>
                    <div style={styles.statNumber}>
                      {orderStatsLoading ? '...' : orderStats.shipped}
                    </div>
                    <div style={styles.statLabel}>Shipped</div>
                  </div>
                </div>
                <button style={styles.viewOrdersBtn} onClick={() => navigate('/orders')}>
                  View All Orders
                </button>
              </div>
            </div>
          </div>

          {/* Bottom-Right Section - Recently Viewed Products */}
          <div style={styles.recentlyViewedSection}>
            <div style={styles.recentlyViewedCard}>
              <h3 style={styles.sectionTitle}>Recently Viewed Products</h3>
              {recentlyViewed.length === 0 ? (
                <div style={styles.emptyState}>No products viewed yet.</div>
              ) : (
                <div style={styles.recentlyViewedGrid}>
                  {recentlyViewed.slice(0, 6).map(product => (
                                         <div
                       key={product._id}
                       style={styles.recentlyViewedItem}
                       onClick={() => navigate(`/product/${product._id}`)}
                       tabIndex={0}
                       onKeyDown={e => { if (e.key === 'Enter') navigate(`/product/${product._id}`); }}
                       role="button"
                     >
                      <div style={styles.recentlyViewedImgWrap}>
                        <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                      </div>
                      <div style={styles.recentlyViewedInfo}>
                        <div style={styles.recentlyViewedName}>{product.name}</div>
                        <div style={styles.recentlyViewedPrice}>₹{Number(product.price).toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  bg: {
    minHeight: '100vh',
    background: '#f8fafc',
    fontFamily: 'Montserrat, sans-serif',
    padding: '2rem',
    width: '99vw',
    overflowX: 'hidden',
  },
  container: {
    maxWidth: 1400,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    height: 'fit-content',
  },
  profileSection: {
    display: 'flex',
    flexDirection: 'column',
  },
  profileCard: {
    background: '#fff',
    borderRadius: 24,
    boxShadow: '0 2px 16px #e5e7eb',
    padding: '2.5rem 2rem',
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  rightSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#a78bfa',
    margin: 0,
  },
  editBtn: {
    background: 'none',
    border: 'none',
    color: '#a78bfa',
    cursor: 'pointer',
    padding: 4,
    borderRadius: 8,
    transition: 'background 0.2s',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  label: {
    fontWeight: 600,
    color: '#888',
    fontSize: '1rem',
    marginBottom: 2,
  },
  value: {
    fontWeight: 600,
    color: '#18181b',
    fontSize: '1.1rem',
    marginBottom: 8,
  },
  input: {
    border: '1.5px solid #e5e7eb',
    borderRadius: 10,
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#a78bfa',
    marginBottom: 8,
    outline: 'none',
  },
  saveBtn: {
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
    marginTop: 12,
  },
  error: {
    color: '#ff6b6b',
    fontWeight: 600,
    marginTop: 8,
  },
  success: {
    color: '#10b981',
    fontWeight: 600,
    marginTop: 8,
  },
  loading: {
    textAlign: 'center',
    color: '#a78bfa',
    fontWeight: 700,
    fontSize: '1.2rem',
    margin: '2rem 0',
  },
  sectionDivider: {
    height: 1,
    background: '#e5e7eb',
    margin: '24px 0',
    width: '100%',
  },
  addressSection: {
    marginTop: 8,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  addressHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  addressTitle: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#a78bfa',
    margin: 0,
  },
  addressBtn: {
    background: 'linear-gradient(90deg, #2563eb, #fbbf24)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '0.5rem 1.2rem',
    fontWeight: 700,
    fontSize: '1rem',
    cursor: 'pointer',
    boxShadow: '0 2px 8px #fbbf2433',
    marginLeft: 10,
    letterSpacing: 0.5,
    transition: 'background 0.2s, box-shadow 0.2s',
    outline: 'none',
  },
  addressHint: {
    color: '#888',
    fontSize: '0.98rem',
    marginTop: 2,
    marginLeft: 2,
  },
  defaultAddressCard: {
    background: '#fff',
    borderRadius: 14,
    boxShadow: '0 2px 8px #fbbf2433',
    border: '2px solid #fbbf24',
    padding: '1.2rem 1.5rem',
    marginTop: 8,
    marginBottom: 8,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    alignItems: 'flex-start',
    fontSize: '1rem',
    fontWeight: 500,
  },
  defaultBadge: {
    background: '#fbbf24',
    color: '#fff',
    borderRadius: 8,
    padding: '2px 12px',
    fontWeight: 800,
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
    boxShadow: '0 2px 8px #fbbf2433',
  },
  defaultName: {
    fontWeight: 700,
    color: '#a78bfa',
    fontSize: '1.1rem',
    marginBottom: 2,
  },
  defaultLine: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    color: '#18181b',
    fontWeight: 500,
    fontSize: '1rem',
  },
  addressLoading: {
    color: '#a78bfa',
    fontWeight: 600,
    fontSize: '1rem',
    margin: '8px 0',
  },
  otherAddressesSection: {
    marginTop: 18,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  otherAddressesTitle: {
    fontWeight: 700,
    color: '#a78bfa',
    fontSize: '1.08rem',
    marginBottom: 4,
  },
  otherAddressCard: {
    background: '#fff',
    borderRadius: 10,
    boxShadow: '0 2px 8px #e5e7eb',
    border: '1.5px solid #e5e7eb',
    padding: '1rem 1.2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    alignItems: 'flex-start',
    fontSize: '1rem',
    fontWeight: 500,
  },
  setDefaultBtn: {
    background: 'linear-gradient(90deg, #2563eb, #fbbf24)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '0.4rem 1.1rem',
    fontWeight: 700,
    fontSize: '1rem',
    cursor: 'pointer',
    boxShadow: '0 2px 8px #fbbf2433',
    marginTop: 8,
    letterSpacing: 0.5,
    transition: 'background 0.2s, box-shadow 0.2s',
    outline: 'none',
  },
  logoutSection: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 8,
  },
  logoutBtn: {
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    padding: '0.8rem 2rem',
    fontWeight: 700,
    fontSize: '1rem',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
    transition: 'all 0.2s',
    outline: 'none',
    width: '100%',
  },
  // Orders Section Styles
  ordersSection: {
    display: 'flex',
    flexDirection: 'column',
  },
  ordersCard: {
    background: '#fff',
    borderRadius: 24,
    boxShadow: '0 2px 16px #e5e7eb',
    padding: '2rem',
    height: 'fit-content',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#1f2937',
    marginBottom: '1.5rem',
  },
  ordersContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  orderStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
  },
  statItem: {
    textAlign: 'center',
    padding: '1rem',
    background: '#f8fafc',
    borderRadius: 12,
    border: '1px solid #e5e7eb',
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: 800,
    color: '#667eea',
    marginBottom: '0.5rem',
  },
  statLabel: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#6b7280',
  },
  viewOrdersBtn: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    padding: '0.8rem 1.5rem',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    outline: 'none',
  },
  // Recently Viewed Section Styles
  recentlyViewedSection: {
    display: 'flex',
    flexDirection: 'column',
  },
  recentlyViewedCard: {
    background: '#fff',
    borderRadius: 24,
    boxShadow: '0 2px 16px #e5e7eb',
    padding: '2rem',
    height: 'fit-content',
  },
  emptyState: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '1rem',
    fontWeight: 500,
    padding: '2rem',
  },
  recentlyViewedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
  },
  recentlyViewedItem: {
    display: 'flex',
    flexDirection: 'column',
    background: '#f8fafc',
    borderRadius: 12,
    padding: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '1px solid #e5e7eb',
  },
  recentlyViewedImgWrap: {
    width: '100%',
    aspectRatio: '1/1',
    background: '#f4f4f6',
    borderRadius: 8,
    marginBottom: '0.8rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  recentlyViewedInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
  },
  recentlyViewedName: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#1f2937',
    lineHeight: '1.3',
  },
  recentlyViewedPrice: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#667eea',
  },
};

const recentlyViewedGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '1.5rem',
  marginTop: 8,
  marginBottom: 8,
  width: '100%',
};
const recentlyViewedCard = {
  background: '#fff',
  borderRadius: 12,
  boxShadow: '0 1px 6px #e5e7eb',
  padding: '1.2rem 1rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer',
  border: '1px solid #f3e8ff',
  minHeight: 220,
  boxSizing: 'border-box',
  overflow: 'hidden',
  maxWidth: 280,
  margin: '0 auto',
  transition: 'transform 0.15s, box-shadow 0.15s',
};
const recentlyViewedImgWrap = {
  width: '100%',
  aspectRatio: '1/1',
  background: '#f4f4f6',
  borderRadius: 8,
  marginBottom: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  maxWidth: 200,
  minHeight: 150,
};

export default Profile; 