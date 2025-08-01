import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/userSlice';
import { setCart } from '../../redux/cartSlice';
import { setWishlist } from '../../redux/wishlistSlice';
import { fetchUserCart, fetchUserWishlist } from '../utils/auth';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const API_URL = import.meta.env.VITE_API_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
        const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
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
    <div className="login-container">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="gradient-orb orb-4"></div>
        <div className="gradient-orb orb-5"></div>
        <div className="floating-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`}></div>
          ))}
        </div>
      </div>

      {/* Left Side - Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <div className="brand-logo">
            <div className="logo-icon">
              <User size={40} />
            </div>
            <h1 className="brand-name">UV's Store</h1>
          </div>
          
          <div className="welcome-text">
            <h2 className="welcome-title">Welcome Back!</h2>
            <p className="welcome-subtitle">
              Sign in to continue your amazing shopping journey with us. 
              Discover premium products and exclusive deals.
            </p>
          </div>
          
          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon">✨</div>
              <span>Premium Quality Products</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🚚</div>
              <span>Fast & Free Delivery</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔒</div>
              <span>Secure Shopping</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="form-section">
        <div className="login-card">
          <div className="card-header">
            <h2 className="form-title">Sign In</h2>
            <p className="form-subtitle">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <div className="input-icon">
                <Mail size={20} />
              </div>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="form-input"
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <div className="input-icon">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="form-input"
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" className="checkbox" />
                <span className="checkmark"></span>
                Remember me
              </label>
              <button type="button" className="forgot-password">
                Forgot Password?
              </button>
            </div>

            <button 
              type="submit" 
              className={`submit-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="message error-message">
              <span>❌ {error}</span>
            </div>
          )}
          
          {success && (
            <div className="message success-message">
              <span>✅ Login successful! Redirecting...</span>
            </div>
          )}

          <div className="signup-prompt">
            <p>Don't have an account? 
              <button
                onClick={() => navigate('/register')}
                className="signup-link"
                disabled={loading}
              >
                Create Account
              </button>
            </p>
          </div>


        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .login-container {
          height: 92vh;
          width: 100vw;
          display: flex;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }

        /* Animated Background */
        .animated-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%);
          background-size: 400% 400%;
          animation: gradientShift 8s ease-in-out infinite;
          z-index: -2;
        }

        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.4;
          animation: float 6s ease-in-out infinite;
        }

        .orb-1 {
          width: 300px;
          height: 300px;
          background: linear-gradient(45deg, #ff6b6b, #ffd93d);
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 400px;
          height: 400px;
          background: linear-gradient(45deg, #6c5ce7, #a29bfe);
          top: 50%;
          right: 20%;
          animation-delay: 2s;
        }

        .orb-3 {
          width: 250px;
          height: 250px;
          background: linear-gradient(45deg, #00cec9, #55efc4);
          bottom: 20%;
          left: 30%;
          animation-delay: 4s;
        }

        .orb-4 {
          width: 350px;
          height: 350px;
          background: linear-gradient(45deg, #fd79a8, #fdcb6e);
          top: 70%;
          right: 10%;
          animation-delay: 1s;
        }

        .orb-5 {
          width: 200px;
          height: 200px;
          background: linear-gradient(45deg, #e84393, #fd79a8);
          top: 30%;
          left: 60%;
          animation-delay: 3s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          33% {
            transform: translateY(-30px) rotate(120deg) scale(1.1);
          }
          66% {
            transform: translateY(20px) rotate(240deg) scale(0.9);
          }
        }

        .floating-particles {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          animation: particleFloat 8s linear infinite;
        }

        .particle-1 { left: 10%; animation-delay: 0s; }
        .particle-2 { left: 20%; animation-delay: 1s; }
        .particle-3 { left: 30%; animation-delay: 2s; }
        .particle-4 { left: 40%; animation-delay: 3s; }
        .particle-5 { left: 50%; animation-delay: 4s; }
        .particle-6 { left: 60%; animation-delay: 5s; }
        .particle-7 { left: 70%; animation-delay: 6s; }
        .particle-8 { left: 80%; animation-delay: 7s; }
        .particle-9 { left: 90%; animation-delay: 0.5s; }
        .particle-10 { left: 15%; animation-delay: 1.5s; }
        .particle-11 { left: 25%; animation-delay: 2.5s; }
        .particle-12 { left: 35%; animation-delay: 3.5s; }
        .particle-13 { left: 45%; animation-delay: 4.5s; }
        .particle-14 { left: 55%; animation-delay: 5.5s; }
        .particle-15 { left: 65%; animation-delay: 6.5s; }
        .particle-16 { left: 75%; animation-delay: 7.5s; }
        .particle-17 { left: 85%; animation-delay: 0.2s; }
        .particle-18 { left: 95%; animation-delay: 1.2s; }
        .particle-19 { left: 5%; animation-delay: 2.2s; }
        .particle-20 { left: 12%; animation-delay: 3.2s; }

        @keyframes particleFloat {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }

        /* Welcome Section */
        .welcome-section {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
          z-index: 1;
          animation: slideInLeft 1s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .welcome-content {
          max-width: 500px;
          color: white;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          margin-bottom: 3rem;
          animation: fadeInUp 1s ease-out 0.3s both;
        }

        .logo-icon {
          width: 60px;
          height: 60px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .brand-name {
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .welcome-text {
          margin-bottom: 3rem;
          animation: fadeInUp 1s ease-out 0.5s both;
        }

        .welcome-title {
          font-size: 3rem;
          font-weight: 900;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .welcome-subtitle {
          font-size: 1.2rem;
          font-weight: 400;
          opacity: 0.9;
          line-height: 1.6;
        }

        .feature-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          animation: fadeInUp 1s ease-out 0.7s both;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-weight: 500;
          font-size: 1.1rem;
        }

        .feature-icon {
          font-size: 1.5rem;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          backdrop-filter: blur(10px);
        }

        /* Form Section */
        .form-section {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
          z-index: 1;
          animation: slideInRight 1s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .login-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 30px;
          padding: 3rem 2.5rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          width: 100%;
          max-width: 450px;
          animation: fadeInScale 1s ease-out 0.3s both;
        }

        @keyframes fadeInScale {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .card-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .form-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .form-subtitle {
          color: #666;
          font-weight: 500;
          font-size: 1rem;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .input-group {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          color: #667eea;
          z-index: 2;
          display: flex;
          align-items: center;
        }

        .form-input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border: 2px solid rgba(102, 126, 234, 0.1);
          border-radius: 15px;
          font-size: 1rem;
          font-weight: 500;
          background: rgba(255, 255, 255, 0.9);
          transition: all 0.3s ease;
          outline: none;
          color: #333;
        }

        .form-input::placeholder {
          color: #999;
          font-weight: 400;
        }

        .form-input:focus {
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-input:focus::placeholder {
          color: #ccc;
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .password-toggle:hover {
          color: #667eea;
          background: rgba(102, 126, 234, 0.1);
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0.5rem 0;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
          color: #666;
          cursor: pointer;
        }

        .checkbox {
          width: 18px;
          height: 18px;
          border: 2px solid #667eea;
          border-radius: 4px;
          appearance: none;
          cursor: pointer;
          position: relative;
        }

        .checkbox:checked {
          background: #667eea;
        }

        .checkbox:checked::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 12px;
          font-weight: bold;
        }

        .forgot-password {
          background: none;
          border: none;
          color: #667eea;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .forgot-password:hover {
          color: #5a67d8;
        }

        .submit-button {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 15px;
          padding: 1rem 2rem;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .submit-button:hover:not(.loading) {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }

        .submit-button.loading {
          cursor: not-allowed;
          opacity: 0.8;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .message {
          margin-top: 1rem;
          padding: 0.8rem 1rem;
          border-radius: 10px;
          font-weight: 600;
          text-align: center;
          animation: slideDown 0.3s ease-out;
        }

        .error-message {
          background: rgba(255, 107, 107, 0.1);
          color: #ff6b6b;
          border: 1px solid rgba(255, 107, 107, 0.2);
        }

        .success-message {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        @keyframes slideDown {
          from {
            transform: translateY(-10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .signup-prompt {
          text-align: center;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        }

        .signup-prompt p {
          color: #666;
          font-weight: 500;
        }

        .signup-link {
          background: none;
          border: none;
          color: #667eea;
          font-weight: 700;
          cursor: pointer;
          margin-left: 0.5rem;
          transition: color 0.3s ease;
        }

        .signup-link:hover {
          color: #5a67d8;
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

        /* Responsive Design */
        @media (max-width: 768px) {
          .login-container {
            flex-direction: column;
          }
          
          .welcome-section {
            flex: none;
            padding: 1rem;
            min-height: 40vh;
          }
          
          .welcome-title {
            font-size: 2rem;
          }
          
          .form-section {
            flex: none;
            padding: 1rem;
          }
          
          .login-card {
            padding: 2rem 1.5rem;
          }
          
          .form-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Login;