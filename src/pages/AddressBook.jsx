import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Plus, Edit, Trash2, Star, StarOff, Phone, MapPin, User, Package } from 'lucide-react';

const API = `${import.meta.env.VITE_API_URL}/api/address`;

const AddressBook = () => {
  const user = useSelector(state => state.user.user);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ fullName: '', phone: '', street: '', city: '', state: '', zip: '', country: '', isDefault: false });

  // Fetch addresses
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch(API, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(res => res.json())
      .then(data => { setAddresses(data); setLoading(false); })
      .catch(e => { setError('Failed to load addresses'); setLoading(false); });
  }, [user]);
  
  // Open form for add/edit
  const openForm = (address = null) => {
    setEditId(address ? address._id : null);
    setForm(address ? { ...address } : { fullName: '', phone: '', street: '', city: '', state: '', zip: '', country: '', isDefault: false });
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditId(null); };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `${API}/${editId}` : API;
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
      body: JSON.stringify(form),
    });
    if (!res.ok) { setError('Failed to save address'); setLoading(false); return; }
    // Refresh list
    fetch(API, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(res => res.json())
      .then(data => { setAddresses(data); setLoading(false); closeForm(); })
      .catch(e => { setError('Failed to load addresses'); setLoading(false); });
  };

  // Delete address
  const handleDelete = async (id) => {
    setLoading(true);
    await fetch(`${API}/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${user.token}` } });
    setAddresses(addresses.filter(a => a._id !== id));
    setLoading(false);
  };

  // Set default address
  const handleSetDefault = async (id) => {
    setLoading(true);
    await fetch(`${API}/${id}/default`, { method: 'PATCH', headers: { Authorization: `Bearer ${user.token}` } });
    // Always refresh the address list after setting default
    const res = await fetch(API, { headers: { Authorization: `Bearer ${user.token}` } });
    const data = await res.json();
    setAddresses(data);
    setLoading(false);
  };

  if (!user) return (
    <div style={styles.bg}>
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <User size={64} style={{ color: '#a78bfa', opacity: 0.7, marginBottom: '1rem' }} />
          <h2 style={styles.emptyTitle}>Welcome to Your Address Book</h2>
          <p style={styles.emptyText}>Please log in to manage your addresses</p>
        </div>
      </div>
    </div>
  );

  const sortedAddresses = [...addresses];

  return (
    <div style={styles.bg}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Your Address Book</h1>
            <p style={styles.subtitle}>Manage your delivery addresses with ease</p>
          </div>
          <button 
            style={styles.addBtn} 
            onClick={() => openForm()}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <Plus size={20} />
            Add New Address
          </button>
        </div>

        {loading ? (
          <div style={styles.loadingState}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Loading your addresses...</p>
          </div>
        ) : error ? (
          <div style={styles.errorState}>
            <div style={styles.errorIcon}>⚠️</div>
            <h3 style={styles.errorTitle}>Oops! Something went wrong</h3>
            <p style={styles.errorText}>{error}</p>
          </div>
        ) : sortedAddresses.length === 0 ? (
          <div style={styles.emptyState}>
            <Package size={64} style={{ color: '#a78bfa', opacity: 0.7, marginBottom: '1rem' }} />
            <h2 style={styles.emptyTitle}>No addresses yet</h2>
            <p style={styles.emptyText}>Add your first address to get started with deliveries</p>
            <button 
              style={styles.emptyActionBtn} 
              onClick={() => openForm()}
            >
              <Plus size={18} />
              Add Your First Address
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {sortedAddresses.map((addr, index) => (
              <div 
                key={addr._id} 
                style={{
                  ...styles.card,
                  animationDelay: `${index * 0.1}s`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(167, 139, 250, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(167, 139, 250, 0.15)';
                }}
              >
                <div style={styles.cardHeader}>
                  <div style={styles.cardHeaderContent}>
                    <h3 style={styles.cardName}>{addr.fullName}</h3>
                    {addr.isDefault && (
                      <span style={styles.defaultBadge}>
                        <Star size={14} style={{ fill: 'currentColor' }} />
                        Default
                      </span>
                    )}
                  </div>
                </div>
                
                <div style={styles.cardBody}>
                  <div style={styles.addressLine}>
                    <MapPin size={16} style={styles.icon} />
                    <span>{addr.street}, {addr.city}, {addr.state} {addr.zip}, {addr.country}</span>
                  </div>
                  <div style={styles.addressLine}>
                    <Phone size={16} style={styles.icon} />
                    <span>{addr.phone}</span>
                  </div>
                </div>
                
                <div style={styles.cardActions}>
                  <button 
                    style={styles.deliverBtn}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    <Package size={16} />
                    Deliver Here
                  </button>
                  <div style={styles.actionButtons}>
                    <button 
                      style={styles.iconBtn} 
                      onClick={() => openForm(addr)} 
                      title="Edit Address"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      style={{...styles.iconBtn, ...styles.deleteBtn}} 
                      onClick={() => handleDelete(addr._id)} 
                      title="Delete Address"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <div style={styles.modalOverlay} onClick={closeForm}>
            <div 
              style={styles.modal} 
              onClick={e => e.stopPropagation()}
            >
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>
                  {editId ? 'Edit Address' : 'Add New Address'}
                </h2>
                <p style={styles.modalSubtitle}>
                  {editId ? 'Update your address information' : 'Fill in the details below'}
                </p>
              </div>
              
              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formRow}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Full Name</label>
                    <input 
                      style={styles.input} 
                      placeholder="Enter full name" 
                      value={form.fullName} 
                      onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} 
                      required 
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Phone Number</label>
                    <input 
                      style={styles.input} 
                      placeholder="Enter phone number" 
                      value={form.phone} 
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} 
                      required 
                    />
                  </div>
                </div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Street Address</label>
                  <input 
                    style={styles.input} 
                    placeholder="Enter street address" 
                    value={form.street} 
                    onChange={e => setForm(f => ({ ...f, street: e.target.value }))} 
                    required 
                  />
                </div>
                
                <div style={styles.formRow}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>City</label>
                    <input 
                      style={styles.input} 
                      placeholder="Enter city" 
                      value={form.city} 
                      onChange={e => setForm(f => ({ ...f, city: e.target.value }))} 
                      required 
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>State</label>
                    <input 
                      style={styles.input} 
                      placeholder="Enter state" 
                      value={form.state} 
                      onChange={e => setForm(f => ({ ...f, state: e.target.value }))} 
                      required 
                    />
                  </div>
                </div>
                
                <div style={styles.formRow}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>ZIP Code</label>
                    <input 
                      style={styles.input} 
                      placeholder="Enter ZIP code" 
                      value={form.zip} 
                      onChange={e => setForm(f => ({ ...f, zip: e.target.value }))} 
                      required 
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Country</label>
                    <input 
                      style={styles.input} 
                      placeholder="Enter country" 
                      value={form.country} 
                      onChange={e => setForm(f => ({ ...f, country: e.target.value }))} 
                      required 
                    />
                  </div>
                </div>
                
                <label style={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    style={styles.checkbox}
                    checked={form.isDefault} 
                    onChange={e => setForm(f => ({ ...f, isDefault: e.target.checked }))} 
                  />
                  <span style={styles.checkboxText}>Set as default address</span>
                </label>
                
                <div style={styles.modalActions}>
                  <button 
                    type="button" 
                    style={styles.cancelBtn} 
                    onClick={closeForm}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    style={styles.saveBtn}
                  >
                    {editId ? 'Save Changes' : 'Add Address'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  bg: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '2rem 1rem',
    position: 'relative',
    overflow: 'hidden',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 1,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '3rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  title: {
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: '0.5rem',
    textShadow: '0 2px 20px rgba(255,255,255,0.3)',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '400',
    margin: 0,
  },
  addBtn: {
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '16px',
    padding: '1rem 2rem',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2rem',
    animation: 'fadeInUp 0.6s ease-out',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '24px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(167, 139, 250, 0.15)',
    backdrop: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    animation: 'slideIn 0.6s ease-out forwards',
    opacity: 0,
    transform: 'translateY(20px)',
  },
  cardHeader: {
    marginBottom: '1.5rem',
  },
  cardHeaderContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  cardName: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: 0,
    letterSpacing: '-0.01em',
  },
  defaultBadge: {
    background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
    color: '#ffffff',
    borderRadius: '12px',
    padding: '0.25rem 0.75rem',
    fontSize: '0.75rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
  },
  cardBody: {
    marginBottom: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  addressLine: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    color: '#4b5563',
    fontSize: '0.95rem',
    lineHeight: '1.5',
  },
  icon: {
    color: '#8b5cf6',
    marginTop: '0.125rem',
    flexShrink: 0,
  },
  cardActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid #f3f4f6',
  },
  deliverBtn: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    padding: '0.75rem 1.5rem',
    fontWeight: '600',
    fontSize: '0.9rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
  },
  actionButtons: {
    display: 'flex',
    gap: '0.5rem',
  },
  iconBtn: {
    background: 'rgba(99, 102, 241, 0.1)',
    border: 'none',
    borderRadius: '10px',
    padding: '0.75rem',
    cursor: 'pointer',
    color: '#6366f1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(10px)',
  },
  deleteBtn: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(8px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    animation: 'fadeIn 0.3s ease-out',
  },
  modal: {
    background: '#ffffff',
    borderRadius: '24px',
    padding: '2.5rem',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255,255,255,0.2)',
    animation: 'slideInModal 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  modalHeader: {
    marginBottom: '2rem',
    textAlign: 'center',
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '0.5rem',
    letterSpacing: '-0.01em',
  },
  modalSubtitle: {
    color: '#6b7280',
    fontSize: '0.95rem',
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
    letterSpacing: '0.01em',
  },
  input: {
    padding: '0.875rem 1rem',
    borderRadius: '12px',
    border: '2px solid #e5e7eb',
    fontSize: '0.95rem',
    transition: 'all 0.2s ease',
    background: '#f9fafb',
    color: '#1f2937',
    fontFamily: 'inherit',
    outline: 'none',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    background: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  checkbox: {
    width: '1.25rem',
    height: '1.25rem',
    accentColor: '#8b5cf6',
  },
  checkboxText: {
    fontSize: '0.95rem',
    fontWeight: '500',
    color: '#374151',
  },
  modalActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    paddingTop: '1rem',
  },
  cancelBtn: {
    background: 'transparent',
    color: '#6b7280',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    padding: '0.75rem 1.5rem',
    fontWeight: '600',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  saveBtn: {
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    padding: '0.75rem 2rem',
    fontWeight: '600',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '0.5rem',
  },
  emptyText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '1rem',
    marginBottom: '2rem',
  },
  emptyActionBtn: {
    background: 'rgba(255, 255, 255, 0.2)',
    color: '#ffffff',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '16px',
    padding: '1rem 2rem',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
  },
  loadingState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(255,255,255,0.3)',
    borderTop: '4px solid #ffffff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 1rem',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: '1.1rem',
    fontWeight: '500',
  },
  errorState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    background: 'rgba(239, 68, 68, 0.1)',
    borderRadius: '24px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
  },
  errorIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  errorTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '0.5rem',
  },
  errorText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: '1rem',
  },
};

// Add keyframe animations via a style tag
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes fadeInUp {
    from { 
      opacity: 0; 
      transform: translateY(30px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
  
  @keyframes slideIn {
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
  
  @keyframes slideInModal {
    from { 
      opacity: 0; 
      transform: translateY(-20px) scale(0.95); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0) scale(1); 
    }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

if (!document.head.querySelector('style[data-address-book]')) {
  styleSheet.setAttribute('data-address-book', 'true');
  document.head.appendChild(styleSheet);
}

export default AddressBook;