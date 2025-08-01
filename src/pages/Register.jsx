import { useState } from 'react';
import { User, Mail, Lock, Phone, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/userSlice';
import { setCart } from '../../redux/cartSlice';
import { setWishlist } from '../../redux/wishlistSlice';
import { fetchUserCart, fetchUserWishlist } from '../utils/auth';
const API_URL = import.meta.env.VITE_API_URL;
function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
          const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      
      setSuccess(true);
      // Store user info in Redux and localStorage
      dispatch(setUser(data));
      
      // Fetch user's cart and wishlist from backend
      try {
        const [cartItems, wishlistItems] = await Promise.all([
          fetchUserCart(data.token),
          fetchUserWishlist(data.token)
        ]);
        dispatch(setCart(cartItems));
        dispatch(setWishlist(wishlistItems));
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
      
      setTimeout(() => navigate('/home'), 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
          <div className="shape shape-6"></div>
        </div>
        <div className="gradient-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="content-wrapper">
        <div className="register-card">
          <div className="card-header">
            <div className="logo-container">
              <Sparkles className="logo-icon" size={32} />
              <h1 className="brand-name">UV's Store</h1>
            </div>
            <h2 className="main-title">Create Account</h2>
            <p className="subtitle">Join our amazing community</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="input-group">
              <div className="input-container">
                <User className="input-icon" size={20} />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={loading}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <div className="input-container">
                <Mail className="input-icon" size={20} />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={loading}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <div className="input-container">
                <Phone className="input-icon" size={20} />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={loading}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <div className="input-container">
                <Lock className="input-icon" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  disabled={loading}
                  className="form-input"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`submit-btn ${loading ? 'loading' : ''}`}
            >
              <span className="btn-text">
                {loading ? 'Creating Account...' : 'Create Account'}
              </span>
              <div className="btn-shimmer"></div>
            </button>
          </form>

          {error && (
            <div className="message error-message">
              {error}
            </div>
          )}

          {success && (
            <div className="message success-message">
              Registration successful! Welcome aboard! 🎉
            </div>
          )}

          <div className="login-link">
            <span>Already have an account?</span>
            <button 
              type="button"
              onClick={() => navigate('/login')}
              className="link-btn" 
              disabled={loading}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .register-container {
          min-height: 100vh;
          width: 100vw;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .animated-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, 
            #667eea 0%, 
            #764ba2 25%, 
            #f093fb 50%, 
            #f5576c 75%, 
            #4facfe 100%);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .floating-shapes {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .shape {
          position: absolute;
          background: linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
          border-radius: 50%;
          animation: float 20s infinite linear;
        }

        .shape-1 {
          width: 80px;
          height: 80px;
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 120px;
          height: 120px;
          top: 70%;
          left: 80%;
          animation-delay: -5s;
        }

        .shape-3 {
          width: 60px;
          height: 60px;
          top: 20%;
          left: 80%;
          animation-delay: -10s;
        }

        .shape-4 {
          width: 100px;
          height: 100px;
          top: 80%;
          left: 20%;
          animation-delay: -15s;
        }

        .shape-5 {
          width: 140px;
          height: 140px;
          top: 50%;
          left: 5%;
          animation-delay: -7s;
        }

        .shape-6 {
          width: 90px;
          height: 90px;
          top: 30%;
          left: 60%;
          animation-delay: -12s;
        }

        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-30px) rotate(120deg); }
          66% { transform: translateY(30px) rotate(240deg); }
          100% { transform: translateY(0px) rotate(360deg); }
        }

        .gradient-orbs {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
          animation: orbMove 25s infinite ease-in-out;
        }

        .orb-1 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(255,107,107,0.6) 0%, transparent 70%);
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(79,172,254,0.4) 0%, transparent 70%);
          bottom: 20%;
          right: 10%;
          animation-delay: -10s;
        }

        .orb-3 {
          width: 250px;
          height: 250px;
          background: radial-gradient(circle, rgba(167,139,250,0.5) 0%, transparent 70%);
          top: 60%;
          left: 60%;
          animation-delay: -15s;
        }

        @keyframes orbMove {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(50px, -30px) scale(1.1); }
          50% { transform: translate(-30px, 40px) scale(0.9); }
          75% { transform: translate(40px, 20px) scale(1.05); }
        }

        .content-wrapper {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 420px;
          padding: 20px;
        }

        .register-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px) saturate(180%);
          border-radius: 24px;
          padding: 40px 32px;
          box-shadow: 
            0 32px 64px rgba(0, 0, 0, 0.1),
            0 16px 32px rgba(0, 0, 0, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.2);
          animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }

        .register-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(79,172,254,0.8), transparent);
          animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .card-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .logo-icon {
          color: #667eea;
          animation: sparkle 2s ease-in-out infinite;
        }

        @keyframes sparkle {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.1) rotate(180deg); }
        }

        .brand-name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 24px;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .main-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 32px;
          font-weight: 700;
          color: #1a1a2e;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }

        .subtitle {
          color: #64748b;
          font-size: 16px;
          font-weight: 500;
        }

        .register-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .input-group {
          position: relative;
        }

        .input-container {
          position: relative;
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          padding: 16px 20px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          backdrop-filter: blur(10px);
        }

        .input-container:focus-within {
          border-color: #667eea;
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 
            0 0 0 4px rgba(102, 126, 234, 0.1),
            0 8px 25px rgba(102, 126, 234, 0.15);
          transform: translateY(-2px);
        }

        .input-icon {
          color: #94a3b8;
          margin-right: 12px;
          transition: color 0.3s ease;
        }

        .input-container:focus-within .input-icon {
          color: #667eea;
        }

        .form-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 16px;
          font-weight: 500;
          color: #1e293b;
          font-family: 'Inter', sans-serif;
        }

        .form-input::placeholder {
          color: #999;
          font-weight: 400;
        }

        .form-input:focus::placeholder {
          color: #ccc;
        }

        .form-input:disabled {
          color: #64748b;
        }

        .password-toggle {
          background: none;
          border: none;
          cursor: pointer;
          color: #94a3b8;
          padding: 4px;
          border-radius: 8px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .password-toggle:hover {
          color: #667eea;
          background: rgba(102, 126, 234, 0.1);
        }

        .submit-btn {
          position: relative;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 16px;
          padding: 18px 24px;
          font-size: 16px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
          margin-top: 8px;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 
            0 16px 32px rgba(102, 126, 234, 0.3),
            0 8px 16px rgba(102, 126, 234, 0.2);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .submit-btn.loading {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        .btn-text {
          position: relative;
          z-index: 2;
        }

        .btn-shimmer {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transition: left 0.5s;
        }

        .submit-btn:hover .btn-shimmer {
          left: 100%;
        }

        .message {
          padding: 16px;
          border-radius: 12px;
          font-weight: 500;
          text-align: center;
          margin-top: 16px;
          animation: fadeIn 0.5s ease;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .success-message {
          background: rgba(34, 197, 94, 0.1);
          color: #16a34a;
          border: 1px solid rgba(34, 197, 94, 0.2);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .login-link {
          text-align: center;
          margin-top: 24px;
          font-size: 14px;
          color: #64748b;
        }

        .link-btn {
          background: none;
          border: none;
          color: #667eea;
          font-weight: 600;
          cursor: pointer;
          margin-left: 4px;
          font-size: 14px;
          transition: color 0.2s ease;
        }

        .link-btn:hover:not(:disabled) {
          color: #4f46e5;
          text-decoration: underline;
        }

        .link-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 480px) {
          .content-wrapper {
            padding: 16px;
          }
          
          .register-card {
            padding: 32px 24px;
          }
          
          .main-title {
            font-size: 28px;
          }
          
          .brand-name {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
}

export default Register;