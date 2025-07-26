import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Plus, Edit, Trash2, Star, StarOff, Phone, MapPin } from 'lucide-react';

const API = 'http://localhost:5000/api/address';

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

  if (!user) return <div style={styles.center}>Please log in to manage your addresses.</div>;

  // Remove isDefault logic: do not sort by default, do not show star badge or Set as Default button
  const sortedAddresses = [...addresses];

  return (
    <div style={styles.bg}>
      <div style={styles.container}>
        <h1 style={styles.title}>Your Addresses</h1>
        <button style={styles.addBtn} onClick={() => openForm()}><Plus size={22} /> Add Address</button>
        {loading ? (
          <div style={styles.center}>Loading addresses...</div>
        ) : error ? (
          <div style={styles.error}>{error}</div>
        ) : sortedAddresses.length === 0 ? (
          <div style={styles.center}>No addresses found.</div>
        ) : (
          <div style={styles.grid}>
            {sortedAddresses.map(addr => (
              <div key={addr._id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.cardName}>{addr.fullName}</span>
                </div>
                <div style={styles.cardBody}>
                  <div style={styles.addressLine}><MapPin size={16} style={{ marginRight: 6, color: '#a78bfa' }} />{addr.street}, {addr.city}, {addr.state}, {addr.zip}, {addr.country}</div>
                  <div style={styles.addressLine}><Phone size={16} style={{ marginRight: 6, color: '#a78bfa' }} />{addr.phone}</div>
                </div>
                <div style={styles.cardActions}>
                  <button style={styles.deliverBtn}>Deliver to this address</button>
                  <button style={styles.iconBtn} onClick={() => openForm(addr)} title="Edit"><Edit size={18} /></button>
                  <button style={styles.iconBtn} onClick={() => handleDelete(addr._id)} title="Delete"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
        {showForm && (
          <div style={styles.modalOverlay} onClick={closeForm}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
              <h2 style={styles.modalTitle}>{editId ? 'Edit Address' : 'Add Address'}</h2>
              <form onSubmit={handleSubmit} style={styles.form}>
                <input style={styles.input} placeholder="Full Name" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} required />
                <input style={styles.input} placeholder="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
                <input style={styles.input} placeholder="Street" value={form.street} onChange={e => setForm(f => ({ ...f, street: e.target.value }))} required />
                <input style={styles.input} placeholder="City" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} required />
                <input style={styles.input} placeholder="State" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} required />
                <input style={styles.input} placeholder="ZIP" value={form.zip} onChange={e => setForm(f => ({ ...f, zip: e.target.value }))} required />
                <input style={styles.input} placeholder="Country" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} required />
                <label style={styles.checkboxLabel}>
                  <input type="checkbox" checked={form.isDefault} onChange={e => setForm(f => ({ ...f, isDefault: e.target.checked }))} /> Set as default
                </label>
                <div style={styles.modalActions}>
                  <button type="submit" style={styles.saveBtn}>{editId ? 'Save Changes' : 'Add Address'}</button>
                  <button type="button" style={styles.cancelBtn} onClick={closeForm}>Cancel</button>
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
    background: 'linear-gradient(120deg, #a78bfa 0%, #f472b6 100%)',
    fontFamily: 'Montserrat, sans-serif',
    padding: '2rem 0',
    width: '99vw',
    overflowX: 'hidden',
  },
  container: {
    maxWidth: 900,
    margin: '0 auto',
    background: 'rgba(255,255,255,0.25)',
    borderRadius: 24,
    boxShadow: '0 2px 16px #a78bfa33',
    padding: 32,
    width: '100%',
    boxSizing: 'border-box',
    backdropFilter: 'blur(12px)',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 800,
    color: '#a78bfa',
    marginBottom: 24,
    letterSpacing: 1,
    textAlign: 'center',
  },
  addBtn: {
    background: 'linear-gradient(90deg, #2563eb, #fbbf24)',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    padding: '0.8rem 2rem',
    fontWeight: 800,
    fontSize: '1.1rem',
    cursor: 'pointer',
    boxShadow: '0 2px 8px #fbbf2433',
    marginBottom: 28,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    letterSpacing: 1,
    transition: 'background 0.2s, box-shadow 0.2s',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 28,
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 2px 8px #e5e7eb',
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    position: 'relative',
    minHeight: 180,
    border: '1.5px solid #e5e7eb',
    transition: 'box-shadow 0.2s, border 0.2s',
    marginBottom: 0,
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
    width: '100%',
    fontWeight: 800,
    fontSize: '1.15rem',
    color: '#18181b',
    letterSpacing: 0.5,
  },
  defaultBadge: {
    background: '#fbbf24',
    color: '#fff',
    borderRadius: 8,
    padding: '2px 12px',
    fontWeight: 800,
    fontSize: 14,
    marginLeft: 10,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    letterSpacing: 0.5,
    boxShadow: '0 2px 8px #fbbf2433',
  },
  cardBody: {
    color: '#444',
    fontSize: '1.05rem',
    marginBottom: 12,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  addressLine: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
    color: '#18181b',
    fontWeight: 500,
    fontSize: '1rem',
  },
  cardActions: {
    display: 'flex',
    gap: 10,
    marginTop: 10,
    alignItems: 'center',
    width: '100%',
  },
  deliverBtn: {
    background: 'linear-gradient(90deg, #2563eb, #fbbf24)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '0.5rem 1.2rem',
    fontWeight: 700,
    fontSize: '1rem',
    cursor: 'pointer',
    boxShadow: '0 2px 8px #fbbf2433',
    marginRight: 10,
    letterSpacing: 0.5,
    transition: 'background 0.2s, box-shadow 0.2s',
    outline: 'none',
    opacity: 1,
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#2563eb',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
    borderRadius: 8,
    transition: 'background 0.2s, color 0.2s',
    fontWeight: 700,
    fontSize: '1rem',
    textDecoration: 'underline',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.18)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    background: '#fff',
    borderRadius: 18,
    boxShadow: '0 4px 32px #a78bfa33',
    padding: 32,
    minWidth: 320,
    maxWidth: 400,
    width: '100%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: '1.3rem',
    fontWeight: 700,
    color: '#a78bfa',
    marginBottom: 18,
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  input: {
    width: '100%',
    padding: '0.7rem 1rem',
    borderRadius: 8,
    border: '1.5px solid #e5e7eb',
    fontSize: '1rem',
    marginBottom: 2,
    outline: 'none',
    fontFamily: 'inherit',
    background: '#f9f9fb',
    color: '#18181b',
    fontWeight: 500,
    transition: 'border 0.2s',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontWeight: 600,
    color: '#a78bfa',
    margin: '8px 0',
  },
  modalActions: {
    display: 'flex',
    gap: 16,
    marginTop: 12,
    justifyContent: 'center',
  },
  saveBtn: {
    background: 'linear-gradient(90deg, #2563eb, #fbbf24)',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    padding: '0.6rem 1.5rem',
    fontWeight: 700,
    fontSize: '1rem',
    cursor: 'pointer',
    boxShadow: '0 2px 8px #fbbf2433',
  },
  cancelBtn: {
    background: '#fff',
    color: '#2563eb',
    border: '1.5px solid #2563eb',
    borderRadius: 12,
    padding: '0.6rem 1.5rem',
    fontWeight: 700,
    fontSize: '1rem',
    cursor: 'pointer',
    boxShadow: '0 2px 8px #a78bfa22',
  },
  center: {
    textAlign: 'center',
    color: '#a78bfa',
    fontWeight: 700,
    fontSize: '1.2rem',
    margin: '2rem 0',
    background: 'none',
  },
  error: {
    textAlign: 'center',
    color: '#ff6b6b',
    fontWeight: 700,
    fontSize: '1.2rem',
    margin: '2rem 0',
    background: 'none',
  },
};

export default AddressBook; 