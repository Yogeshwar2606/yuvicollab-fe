import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, MapPin, Phone } from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL;
const OrderDetails = () => {
  const user = useSelector(state => state.user.user);
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
      fetch(`${API_URL}/api/orders/${id}`, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(res => res.json())
      .then(data => { setOrder(data); setLoading(false); })
      .catch(() => { setError('Failed to fetch order'); setLoading(false); });
  }, [user, id]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={24} color="#10b981" />;
      case 'shipped':
        return <Package size={24} color="#3b82f6" />;
      case 'paid':
        return <CheckCircle size={24} color="#10b981" />;
      case 'pending':
        return <Clock size={24} color="#f59e0b" />;
      case 'cancelled':
        return <XCircle size={24} color="#ef4444" />;
      default:
        return <Clock size={24} color="#6b7280" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return '#10b981';
      case 'shipped':
        return '#3b82f6';
      case 'paid':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  if (loading) return (
    <div style={styles.loadingContainer}>
      <div style={styles.loading}>Loading order...</div>
    </div>
  );
  if (error) return (
    <div style={styles.errorContainer}>
      <div style={styles.error}>{error}</div>
    </div>
  );
  if (!order) return (
    <div style={styles.errorContainer}>
      <div style={styles.error}>Order not found.</div>
    </div>
  );

  return (
    <div style={styles.bg}>
      <div style={styles.container}>
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate('/orders')}>
            <ArrowLeft size={20} />
            Back to Orders
          </button>
          <h1 style={styles.title}>Order Details</h1>
        </div>

        <div style={styles.content}>
          <div style={styles.mainSection}>
            <div style={styles.orderCard}>
              <div style={styles.orderHeader}>
                <div style={styles.orderInfo}>
                  <div style={styles.orderId}>Order #{order._id.slice(-8).toUpperCase()}</div>
                  <div style={styles.orderDate}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <div style={styles.orderStatus}>
                  {getStatusIcon(order.status)}
                  <span style={{ ...styles.statusText, color: getStatusColor(order.status) }}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              <div style={styles.orderSummary}>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryLabel}>Total Amount:</span>
                  <span style={styles.summaryValue}>₹{Number(order.total).toLocaleString('en-IN')}</span>
                </div>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryLabel}>Payment Status:</span>
                  <span style={{ ...styles.summaryValue, color: order.paymentStatus === 'paid' ? '#10b981' : '#f59e0b' }}>
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            <div style={styles.addressCard}>
              <h3 style={styles.sectionTitle}>Delivery Address</h3>
              <div style={styles.addressInfo}>
                <div style={styles.addressName}>{order.address.fullName}</div>
                <div style={styles.addressLine}>
                  <MapPin size={16} style={{ marginRight: 8, color: '#667eea' }} />
                  {order.address.street}, {order.address.city}, {order.address.state}, {order.address.zip}, {order.address.country}
                </div>
                <div style={styles.addressLine}>
                  <Phone size={16} style={{ marginRight: 8, color: '#667eea' }} />
                  {order.address.phone}
                </div>
              </div>
            </div>

            <div style={styles.itemsCard}>
              <h3 style={styles.sectionTitle}>Order Items</h3>
              <div style={styles.itemsList}>
                {order.items.map((item, index) => (
                  <div key={index} style={styles.itemCard}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      style={styles.itemImg}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80x80?text=Image';
                      }}
                    />
                    <div style={styles.itemInfo}>
                      <div style={styles.itemName}>{item.name}</div>
                      <div style={styles.itemDetails}>
                        <span style={styles.itemQty}>Qty: {item.quantity}</span>
                        <span style={styles.itemPrice}>₹{Number(item.price).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
    width: '99vw', 
    overflowX: 'hidden',
    padding: '2rem'
  },
  container: { 
    maxWidth: 1000, 
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    marginBottom: '1rem'
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'none',
    border: 'none',
    color: '#667eea',
    fontWeight: 600,
    cursor: 'pointer',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    transition: 'all 0.2s'
  },
  title: { 
    fontSize: '2.5rem', 
    fontWeight: 800, 
    color: '#1f2937', 
    margin: 0 
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  mainSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  orderCard: {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb',
    padding: '2rem'
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem'
  },
  orderInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  orderId: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#374151'
  },
  orderDate: {
    fontSize: '1rem',
    color: '#6b7280'
  },
  orderStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  statusText: {
    fontSize: '1rem',
    fontWeight: 600
  },
  orderSummary: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e5e7eb'
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  summaryLabel: {
    fontSize: '0.9rem',
    color: '#6b7280',
    fontWeight: 500
  },
  summaryValue: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#374151'
  },
  addressCard: {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb',
    padding: '2rem'
  },
  sectionTitle: {
    fontSize: '1.3rem',
    fontWeight: 700,
    color: '#374151',
    marginBottom: '1rem'
  },
  addressInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem'
  },
  addressName: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#374151'
  },
  addressLine: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1rem',
    color: '#6b7280'
  },
  itemsCard: {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb',
    padding: '2rem'
  },
  itemsList: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '1rem'
  },
  itemCard: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '1rem', 
    background: '#f8fafc', 
    borderRadius: '12px', 
    padding: '1rem',
    border: '1px solid #e5e7eb'
  },
  itemImg: { 
    width: '80px', 
    height: '80px', 
    objectFit: 'cover', 
    borderRadius: '8px', 
    background: '#f3f4f6' 
  },
  itemInfo: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '0.5rem',
    flex: 1
  },
  itemName: { 
    fontWeight: 600, 
    color: '#374151', 
    fontSize: '1rem' 
  },
  itemDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemQty: { 
    color: '#6b7280', 
    fontSize: '0.9rem' 
  },
  itemPrice: { 
    fontWeight: 700, 
    color: '#667eea', 
    fontSize: '1rem' 
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px'
  },
  loading: { 
    color: '#667eea', 
    fontWeight: 700, 
    fontSize: '1.2rem'
  },
  errorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px'
  },
  error: { 
    color: '#ef4444', 
    fontWeight: 700, 
    fontSize: '1.2rem'
  },
};

export default OrderDetails; 