import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, ShoppingBag } from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL;
const OrderHistory = () => {
  const user = useSelector(state => state.user.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      console.log('OrderHistory: useEffect triggered');
      console.log('User state:', user);
      
      if (!user || !user.token) {
        console.log('OrderHistory: No user or token found');
        setLoading(false);
        setError('User not authenticated');
        return;
      }

      try {
        console.log('OrderHistory: Fetching orders for user:', user.id);
        console.log('OrderHistory: Using token:', user.token.substring(0, 20) + '...');
        
        const response = await fetch(`${API_URL}/api/orders`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('OrderHistory: Response status:', response.status);
        console.log('OrderHistory: Response ok:', response.ok);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('OrderHistory: Response error text:', errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('OrderHistory: Orders fetched successfully:', data);
        console.log('OrderHistory: Number of orders:', data.length);
        
        setOrders(data);
        setLoading(false);
      } catch (err) {
        console.error('OrderHistory: Error fetching orders:', err);
        setError(`Failed to fetch orders: ${err.message}`);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={20} color="#10b981" />;
      case 'shipped':
        return <Package size={20} color="#3b82f6" />;
      case 'paid':
        return <CheckCircle size={20} color="#10b981" />;
      case 'pending':
        return <Clock size={20} color="#f59e0b" />;
      case 'cancelled':
        return <XCircle size={20} color="#ef4444" />;
      default:
        return <Clock size={20} color="#6b7280" />;
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

  if (!user) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.error}>Please log in to view your orders.</div>
        <button style={styles.loginBtn} onClick={() => navigate('/login')}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div style={styles.bg}>
      <div style={styles.container}>
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate('/profile')}>
            <ArrowLeft size={20} />
            Back to Profile
          </button>
          <h1 style={styles.title}>My Orders</h1>
        </div>
        
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <div style={styles.loading}>Loading your orders...</div>
          </div>
        ) : error ? (
          <div style={styles.errorContainer}>
            <XCircle size={48} color="#ef4444" />
            <div style={styles.error}>{error}</div>
            <button style={styles.retryBtn} onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div style={styles.emptyContainer}>
            <ShoppingBag size={80} color="#9ca3af" />
            <h3 style={styles.emptyTitle}>No Orders Yet</h3>
            <p style={styles.emptyText}>
              You haven't placed any orders yet. Start shopping to see your order history here.
            </p>
            <button style={styles.shopBtn} onClick={() => navigate('/home')}>
              Start Shopping
            </button>
            {/* Development mode: Show sample order for testing */}
            {process.env.NODE_ENV === 'development' && (
              <div style={{ marginTop: '2rem', padding: '1rem', background: '#f3f4f6', borderRadius: '8px', border: '1px dashed #9ca3af' }}>
                <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1rem' }}>
                  <strong>Development Mode:</strong> Sample order for testing
                </p>
                <div style={styles.orderCard}>
                  <div style={styles.orderHeader}>
                    <div style={styles.orderInfo}>
                      <div style={styles.orderDate}>
                        {new Date().toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div style={styles.orderId}>
                        Order #SAMPLE123
                      </div>
                    </div>
                    <div style={styles.orderStatus}>
                      {getStatusIcon('pending')}
                      <span style={{ ...styles.statusText, color: getStatusColor('pending') }}>
                        Pending
                      </span>
                    </div>
                  </div>
                  
                  <div style={styles.orderItems}>
                    <div style={styles.orderItem}>
                      <img 
                        src="https://via.placeholder.com/50x50?text=Sample" 
                        alt="Sample Product" 
                        style={styles.itemImage}
                      />
                      <div style={styles.itemInfo}>
                        <div style={styles.itemName}>Sample Product</div>
                        <div style={styles.itemQty}>Qty: 1</div>
                      </div>
                    </div>
                  </div>
                  
                  <div style={styles.orderFooter}>
                    <div style={styles.orderTotal}>
                      <span style={styles.totalLabel}>Total:</span>
                      <span style={styles.totalAmount}>
                        ₹1,999
                      </span>
                    </div>
                    <button 
                      style={styles.detailsBtn} 
                      onClick={() => alert('This is a sample order for development testing')}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={styles.orderList}>
            {orders.map(order => (
              <div key={order._id} style={styles.orderCard}>
                <div style={styles.orderHeader}>
                  <div style={styles.orderInfo}>
                    <div style={styles.orderDate}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div style={styles.orderId}>
                      Order #{order._id.slice(-8).toUpperCase()}
                    </div>
                  </div>
                  <div style={styles.orderStatus}>
                    {getStatusIcon(order.status)}
                    <span style={{ ...styles.statusText, color: getStatusColor(order.status) }}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div style={styles.orderItems}>
                  {order.items && order.items.slice(0, 2).map((item, index) => (
                    <div key={index} style={styles.orderItem}>
                      <img 
                        src={item.image || 'https://via.placeholder.com/50x50?text=Image'} 
                        alt={item.name || 'Product'} 
                        style={styles.itemImage}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/50x50?text=Image';
                        }}
                      />
                      <div style={styles.itemInfo}>
                        <div style={styles.itemName}>{item.name || 'Product Name'}</div>
                        <div style={styles.itemQty}>Qty: {item.quantity || 1}</div>
                      </div>
                    </div>
                  ))}
                  {order.items && order.items.length > 2 && (
                    <div style={styles.moreItems}>
                      +{order.items.length - 2} more items
                    </div>
                  )}
                </div>
                
                <div style={styles.orderFooter}>
                  <div style={styles.orderTotal}>
                    <span style={styles.totalLabel}>Total:</span>
                    <span style={styles.totalAmount}>
                      ₹{Number(order.total || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <button 
                    style={styles.detailsBtn} 
                    onClick={() => navigate(`/orders/${order._id}`)}
                  >
                    View Details
                  </button>
                </div>
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
    background: '#f8fafc', 
    width: '100vw', 
    overflowX: 'hidden',
    padding: '2rem'
  },
  container: { 
    maxWidth: 1200, 
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
    transition: 'all 0.2s',
    fontSize: '1rem'
  },
  title: { 
    fontSize: '2.5rem', 
    fontWeight: 800, 
    color: '#1f2937', 
    margin: 0 
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
    gap: '1rem'
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loading: { 
    color: '#667eea', 
    fontWeight: 600, 
    fontSize: '1.1rem'
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
    gap: '1rem',
    textAlign: 'center'
  },
  error: { 
    color: '#ef4444', 
    fontWeight: 600, 
    fontSize: '1.1rem'
  },
  retryBtn: {
    background: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '0.5rem 1rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  loginBtn: {
    background: '#667eea',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '0.5rem 1rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    textAlign: 'center',
    gap: '1.5rem'
  },
  emptyTitle: {
    fontSize: '1.8rem',
    fontWeight: 700,
    color: '#374151',
    margin: 0
  },
  emptyText: {
    fontSize: '1.1rem',
    color: '#6b7280',
    maxWidth: '400px',
    lineHeight: '1.6'
  },
  shopBtn: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '1rem 2rem',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
  },
  orderList: { 
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '1.5rem'
  },
  orderCard: { 
    background: '#fff', 
    borderRadius: '16px', 
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
    border: '1px solid #e5e7eb', 
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    transition: 'all 0.2s',
    cursor: 'pointer'
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: '1rem',
    borderBottom: '1px solid #e5e7eb'
  },
  orderInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem'
  },
  orderDate: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#374151'
  },
  orderId: {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#6b7280'
  },
  orderStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  statusText: {
    fontSize: '0.9rem',
    fontWeight: 600
  },
  orderItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem'
  },
  orderItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem'
  },
  itemImage: {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    borderRadius: '8px',
    background: '#f3f4f6'
  },
  itemInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem'
  },
  itemName: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#374151'
  },
  itemQty: {
    fontSize: '0.8rem',
    color: '#6b7280'
  },
  moreItems: {
    fontSize: '0.8rem',
    color: '#6b7280',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '0.5rem'
  },
  orderFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '1rem',
    borderTop: '1px solid #e5e7eb'
  },
  orderTotal: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem'
  },
  totalLabel: {
    fontSize: '0.8rem',
    color: '#6b7280',
    fontWeight: 500
  },
  totalAmount: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#667eea'
  },
  detailsBtn: { 
    background: 'linear-gradient(135deg, #667eea, #764ba2)', 
    color: '#fff', 
    border: 'none', 
    borderRadius: '10px', 
    padding: '0.6rem 1.2rem', 
    fontWeight: 600, 
    fontSize: '0.9rem', 
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
};

export default OrderHistory;

// Add CSS animation for loading spinner
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style); 