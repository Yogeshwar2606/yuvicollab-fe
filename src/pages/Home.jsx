import React, { useEffect, useState, useRef } from 'react';
import { Search, Sofa, Smartphone, TreePine, ShoppingCart, Heart, Star, TrendingUp, Zap, Gift, Trash2, ShoppingBag, ChevronDown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartWithSync } from '../utils/cartUtils';
import { addWishlistItem, removeWishlistItem } from '../../redux/wishlistSlice';
import { useNavigate } from 'react-router-dom';

const categories = [
  { label: 'All', value: '', icon: <Star size={18} /> },
  { label: 'Furniture', value: 'Furniture', icon: <Sofa size={18} /> },
  { label: 'Electronics', value: 'Electronics', icon: <Smartphone size={18} /> },
  { 
    label: 'Real Estate', 
    value: 'Landscapes', 
    icon: <TreePine size={18} />,
    subcategories: [
      { label: 'All Real Estate', value: 'Landscapes' },
      { label: 'Land Plots', value: 'Landscapes_Plots' },
      { label: 'Individual Houses', value: 'Landscapes_Houses' },
      { label: 'Villas', value: 'Landscapes_Villas' },
      { label: 'Flats', value: 'Landscapes_Flats' }
    ]
  },
];

const sortOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Rating: High to Low', value: 'rating-desc' },
  { label: 'Rating: Low to High', value: 'rating-asc' },
  { label: 'Name: A to Z', value: 'name-asc' },
  { label: 'Name: Z to A', value: 'name-desc' },
];



const bannerSlides = [
  {
    title: "Summer Sale Spectacular",
    subtitle: "Up to 70% OFF on Premium Furniture",
    cta: "Shop Now",
    category: "Furniture",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    icon: <Gift size={24} />,
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e"
  },
  {
    title: "Latest Electronics",
    subtitle: "Cutting-edge technology at your fingertips",
    cta: "Explore",
    category: "Electronics",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    icon: <Zap size={24} />,
    image: "https://images.unsplash.com/photo-1516163109866-e9d98630a0a6"
  },
  {
    title: "Premium Real Estate",
    subtitle: "Discover Plots, Houses & Luxury Villas",
    cta: "Explore",
    category: "Landscapes",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    icon: <TrendingUp size={24} />,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
    subcategories: [
      { label: 'Land Plots', value: 'Landscapes_Plots' },
      { label: 'Individual Houses', value: 'Landscapes_Houses' },
      { label: 'Villas', value: 'Landscapes_Villas' }
    ]
  }
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [showSubcategories, setShowSubcategories] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bannerParallax, setBannerParallax] = useState(0);
  const parallaxTarget = useRef(0);
  const parallaxCurrent = useRef(0);
  const dropdownRef = useRef(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSubcategories(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const wishlist = useSelector(state => state.wishlist.items);
  const cart = useSelector(state => state.cart.items);
  const user = useSelector(state => state.user.user);
  const recentlyViewed = useSelector(state => state.user.recentlyViewedProducts);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products...');
        const res = await fetch('http://localhost:5000/api/products');
        console.log('Response status:', res.status);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        console.log('Products fetched:', data);
        setProducts(data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Auto-rotate banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Smooth Parallax scroll effect for banner
  useEffect(() => {
    let animationFrame;
    let ticking = false;
    const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

    const animate = () => {
      parallaxCurrent.current = lerp(parallaxCurrent.current, parallaxTarget.current, 0.08); // 0.08 = smoothness
      setBannerParallax(parallaxCurrent.current);
      if (Math.abs(parallaxCurrent.current - parallaxTarget.current) > 0.5) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    const handleScroll = () => {
      parallaxTarget.current = window.scrollY * 0.3;
      if (!ticking) {
        animationFrame = requestAnimationFrame(animate);
        ticking = true;
        setTimeout(() => { ticking = false; }, 100); // allow new scrolls
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  const filteredProducts = products.filter(p => {
    // Check if the category matches (including subcategories)
    let categoryMatch = true;
    
    if (category) {
      if (category === 'Landscapes') {
        // Show all real estate products
        categoryMatch = p.category === 'Landscapes';
      } else if (category.startsWith('Landscapes_')) {
        // Show specific real estate subcategory
        const subcategory = category.split('_')[1];
        categoryMatch = p.category === 'Landscapes' && p.subcategory === subcategory;
      } else {
        // Show other categories normally
        categoryMatch = p.category === category;
      }
    }

    // Check if search term matches name or description
    const searchMatch = p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.description.toLowerCase().includes(search.toLowerCase());

    return categoryMatch && searchMatch;
  });

  // Sort products based on selected option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating-desc':
        return (b.rating || 0) - (a.rating || 0);
      case 'rating-asc':
        return (a.rating || 0) - (b.rating || 0);
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  console.log('Products state:', products);
  console.log('Filtered products:', filteredProducts);
  console.log('Sorted products:', sortedProducts);
  console.log('Loading:', loading);
  console.log('Error:', error);

  const handleBannerClick = (slideCategory) => {
    setCategory(slideCategory);
    setSearch('');
    setSortBy('default');
  };

  const handleAddToCart = (product) => {
    addToCartWithSync(dispatch, user, product, 1);
  };

  const handleUpdateQuantity = (product, newQuantity) => {
    if (newQuantity <= 0) {
      // Remove from cart if quantity is 0 or less
      import('../utils/cartUtils').then(({ removeFromCartWithSync }) => {
        removeFromCartWithSync(dispatch, user, product._id);
      });
    } else {
      import('../utils/cartUtils').then(({ updateQuantityWithSync }) => {
        updateQuantityWithSync(dispatch, user, product, newQuantity, product.stock);
      });
    }
  };

  const handleRemoveFromCart = (product) => {
    import('../utils/cartUtils').then(({ removeFromCartWithSync }) => {
      removeFromCartWithSync(dispatch, user, product._id);
    });
  };

  const getCartItemQuantity = (productId) => {
    const cartItem = cart.find(item => {
      if (!item.product) return false;
      if (typeof item.product === 'object') return item.product._id === productId;
      return item.product === productId;
    });
    return cartItem ? cartItem.quantity : 0;
  };

  const isInCart = (productId) => {
    return cart.some(item => {
      if (!item.product) return false;
      if (typeof item.product === 'object') return item.product._id === productId;
      return item.product === productId;
    });
  };

  const isInWishlist = (productId) => wishlist.some(item => item.product && (item.product._id === productId || item.product === productId));
  
  const handleWishlist = (productId) => {
    if (!user) return;
    if (isInWishlist(productId)) {
      const item = wishlist.find(i => i.product && (i.product._id === productId || i.product === productId));
      dispatch(removeWishlistItem({ itemId: item._id, token: user.token }));
    } else {
      dispatch(addWishlistItem({ productId, token: user.token }));
    }
  };

  const handleBuyNow = (e, product) => {
    e.stopPropagation();
    if (!user) {
      alert('Please log in to continue with purchase');
      return;
    }
    if (product.stock === 0) return;
    
    // Add to cart and redirect to checkout
    addToCartWithSync(dispatch, user, product, 1);
    navigate('/checkout');
  };


  return (
    <div className="app-container">
      {/* Floating Shapes */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
        <div className="shape shape-5"></div>
        <div className="shape shape-6"></div>
      </div>

      {/* Search & Categories - All in one line */}
      <div className="search-section">
        <div className="search-container">
          <div className="search-bar">
            <Search size={22} className="search-icon" />
            <input
              type="text"
              placeholder="Search for amazing products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="categories">
            {categories.map(cat => (
              <div key={cat.label} className="category-group">
                <button 
                  className={`category-button ${category.startsWith('Landscapes') ? 'active' : ''}`}
                  onClick={() => {
                    setCategory(category.startsWith('Landscapes') ? '' : 'Landscapes');
                  }}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              </div>
            ))}
          </div>
          <div className="sort-container">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Hero Banner Section */}
      <section className="hero-banner">
        <div className="banner-container">
          {bannerSlides.map((slide, index) => (
            <div
              key={index}
              className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ 
                background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: `center ${bannerParallax}px`, // Parallax effect
                willChange: 'background-position',
                transition: 'background-position 0.3s cubic-bezier(0.4,0,0.2,1)'
              }}
              onClick={() => handleBannerClick(slide.category)}
            >
              <div className="banner-content">
                <div className="banner-icon">{slide.icon}</div>
                <h1 className="banner-title">{slide.title}</h1>
                <p className="banner-subtitle">{slide.subtitle}</p>
                <button className="banner-cta">{slide.cta}</button>
              </div>
              <div className="banner-decoration">
                <div className="floating-element"></div>
                <div className="floating-element-2"></div>
              </div>
            </div>
          ))}
          
        </div>
      </section>

      {/* Real Estate Filters */}
      {category.startsWith('Landscapes') && (
        <div className="real-estate-filters">
          <div className="filter-chips">
            {categories.find(cat => cat.value === 'Landscapes').subcategories.map(sub => (
              <button
                key={sub.value}
                className={`filter-chip ${category === sub.value ? 'active' : ''}`}
                onClick={() => {
                  // If clicking the active chip, clear the filter
                  if (category === sub.value) {
                    setCategory('');
                  } else {
                    setCategory(sub.value);
                  }
                }}
              >
                {sub.label}
                {category === sub.value && (
                  <span className="active-indicator">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Products Section */}
      <div className="products-section">
        <div className="section-header">
          <h2 className="section-title">Featured Products</h2>
          <div className="section-line"></div>
        </div>
        
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading amazing products...</p>
          </div>
        ) : error ? (
          <div className="error-state">{error}</div>
        ) : sortedProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <p>No products found matching your criteria</p>
          </div>
        ) : (
          <div className="products-grid">
            {sortedProducts.map((product, index) => (
              <div 
                key={product._id} 
                className="product-card"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <div className="product-image-container">
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="product-image"
                  />
                  <button
                    className={`wishlist-btn ${isInWishlist(product._id) ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWishlist(product._id);
                    }}
                  >
                    <Heart 
                      size={28} 
                      fill={isInWishlist(product._id) ? '#ff6b6b' : 'none'} 
                      stroke={isInWishlist(product._id) ? '#ff6b6b' : '#666'}
                      strokeWidth={2}
                    />
                  </button>
                  {product.stock === 0 && (
                    <div className="out-of-stock-overlay">
                      <span>Out of Stock</span>
                    </div>
                  )}
                </div>
                
                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <h3 className="product-name">{product.name}</h3>
                  

                  
                  <div className="product-price">₹{Number(product.price).toLocaleString('en-IN')}</div>
                  
                  {/* Cart and Buy Now Buttons */}
                  <div className="product-buttons">
                    {isInCart(product._id) ? (
                      <div className="cart-qty-control">
                        <button
                          className="qty-btn"
                          onClick={e => {
                            e.stopPropagation();
                            handleUpdateQuantity(product, getCartItemQuantity(product._id) - 1);
                          }}
                          disabled={getCartItemQuantity(product._id) <= 1}
                        >
                          –
                        </button>
                        <span className="qty-count">{getCartItemQuantity(product._id)}</span>
                        <button
                          className="qty-btn"
                          onClick={e => {
                            e.stopPropagation();
                            handleUpdateQuantity(product, getCartItemQuantity(product._id) + 1);
                          }}
                          disabled={getCartItemQuantity(product._id) >= product.stock}
                        >
                          +
                        </button>
                        <button
                          className="qty-btn trash"
                          onClick={e => {
                            e.stopPropagation();
                            handleRemoveFromCart(product);
                          }}
                          title="Remove from cart"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          className={`add-to-cart-btn ${product.stock === 0 ? 'disabled' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          disabled={product.stock === 0}
                        >
                          <ShoppingCart size={18} />
                          <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                        </button>
                        <button
                          className={`buy-now-btn ${product.stock === 0 ? 'disabled' : ''}`}
                          onClick={(e) => handleBuyNow(e, product)}
                          disabled={product.stock === 0}
                        >
                          <ShoppingBag size={18} />
                          <span>Buy Now</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recently Viewed Section */}
      {recentlyViewed.length > 0 && (
        <div className="recently-viewed-section">
          <div className="section-header">
            <h2 className="section-title">Recently Viewed</h2>
            <div className="section-line"></div>
          </div>
          
          <div className="products-grid">
            {recentlyViewed.slice(0, 4).map((product, index) => (
              <div
                key={product._id}
                className="product-card small"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <div className="product-image-container">
                  <img src={product.images[0]} alt={product.name} className="product-image" />
                </div>
                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-price">₹{Number(product.price).toLocaleString('en-IN')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          overflow-x: hidden;
        }
        ::-webkit-scrollbar {
          display: none;
        }

        .app-container {
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow-x: hidden;
          width: 100%;
          max-width: 100vw;
        }

        /* Floating Shapes */
        .floating-shapes {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: -1;
        }

        .shape {
          position: absolute;
          border-radius: 50%;
          opacity: 0.1;
          animation: float 6s ease-in-out infinite;
        }

        .shape-1 {
          width: 100px;
          height: 100px;
          background: linear-gradient(45deg, #ff6b6b, #ffd93d);
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 150px;
          height: 150px;
          background: linear-gradient(45deg, #6c5ce7, #a29bfe);
          top: 60%;
          right: 10%;
          animation-delay: 2s;
        }

        .shape-3 {
          width: 80px;
          height: 80px;
          background: linear-gradient(45deg, #00cec9, #55efc4);
          top: 30%;
          right: 30%;
          animation-delay: 4s;
        }

        .shape-4 {
          width: 120px;
          height: 120px;
          background: linear-gradient(45deg, #fd79a8, #fdcb6e);
          bottom: 20%;
          left: 20%;
          animation-delay: 1s;
        }

        .shape-5 {
          width: 60px;
          height: 60px;
          background: linear-gradient(45deg, #e84393, #fd79a8);
          top: 80%;
          left: 60%;
          animation-delay: 3s;
        }

        .shape-6 {
          width: 200px;
          height: 200px;
          background: linear-gradient(45deg, #74b9ff, #0984e3);
          top: 5%;
          right: 5%;
          animation-delay: 5s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          33% {
            transform: translateY(-20px) rotate(120deg) scale(1.1);
          }
          66% {
            transform: translateY(20px) rotate(240deg) scale(0.9);
          }
        }

        /* Hero Banner */
        .hero-banner {
          height: 70vh; /* Increased height for better banner display */
          position: relative;
          overflow: hidden;
          margin-bottom: 2rem;
        }

        .banner-container {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .banner-slide {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: translateX(100%);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .banner-slide.active {
          opacity: 1;
          transform: translateX(0);
        }

        .banner-slide {
          background-size: cover !important;
          background-position: center !important;
          background-repeat: no-repeat !important;
        }

        .banner-content {
          text-align: center;
          color: white;
          z-index: 2;
          max-width: 700px;
          padding: 2rem;
          background: rgba(0,0,0,0.3);
          border-radius: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
        }



        /* Responsive Design */
        @media (max-width: 768px) {
          .banner-slide {
            justify-content: center;
            padding: 1rem;
          }

          .banner-content {
            max-width: 100%;
            padding: 1.5rem;
            margin: 0;
          }

          .banner-title {
            font-size: 2rem;
          }

          .banner-subtitle {
            font-size: 1rem;
          }

          .search-section {
            padding: 1rem;
            min-height: 180px;
          }

          .search-container {
            max-width: 100%;
          }

          .search-bar {
            max-width: 100%;
            padding: 0.8rem 1.2rem;
          }

          .categories {
            max-width: 100%;
            gap: 0.6rem;
          }

          .category-btn {
            padding: 0.6rem 1rem;
            font-size: 0.85rem;
          }

          .products-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            padding: 0 1rem;
          }

          .product-card {
            width: 100%;
            min-height: 380px;
            max-width: 280px;
          }
        }

        .banner-icon {
          margin-bottom: 1rem;
          animation: pulse 2s ease-in-out infinite;
        }

        .banner-title {
          font-size: 3.5rem;
          font-weight: 900;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          animation: slideUp 1s ease-out;
        }

        .banner-subtitle {
          font-size: 1.3rem;
          font-weight: 400;
          margin-bottom: 2rem;
          opacity: 0.9;
          animation: slideUp 1s ease-out 0.2s both;
        }

        .banner-cta {
          background: rgba(255,255,255,0.2);
          color: white;
          border: 2px solid rgba(255,255,255,0.3);
          padding: 1rem 2.5rem;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 50px;
          cursor: pointer;
          backdrop-filter: blur(20px);
          transition: all 0.3s ease;
          animation: slideUp 1s ease-out 0.4s both;
        }

        .banner-cta:hover {
          background: rgba(255,255,255,0.3);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }

        .banner-decoration {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .floating-element,
        .floating-element-2 {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          animation: floatBanner 8s ease-in-out infinite;
        }

        .floating-element {
          width: 300px;
          height: 300px;
          top: -150px;
          right: -150px;
          animation-delay: 0s;
        }

        .floating-element-2 {
          width: 200px;
          height: 200px;
          bottom: -100px;
          left: -100px;
          animation-delay: 4s;
        }

        @keyframes floatBanner {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(180deg);
          }
        }

        .banner-indicators {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 1rem;
        }

        .indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.5);
          background: transparent;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .indicator.active {
          background: white;
          transform: scale(1.2);
        }

        /* Search Section */
        .search-section {
          padding: 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height:10vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .search-container {
          width: 100%;
          max-width: 1200px;
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 1rem;
          flex-wrap: nowrap;
          justify-content: center;
        }

        .search-bar {
          background: rgba(255,255,255,0.95);
          border-radius: 25px;
          padding: 0.8rem 1.2rem;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.2);
          width: 300px;
          max-width: 300px;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .search-bar:focus-within {
          transform: translateY(-2px);
          box-shadow: 0 15px 50px rgba(0,0,0,0.15);
        }

        .search-icon {
          color: #667eea;
          flex-shrink: 0;
        }

        .search-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 1.1rem;
          font-weight: 500;
          color: #333;
          background: transparent;
        }

        .search-input::placeholder {
          color: #999;
        }

        .categories {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          flex-wrap: nowrap;
          width: auto;
          max-width: none;
        }

        .category-btn {
          background: rgba(255,255,255,0.9);
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 20px;
          padding: 0.6rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-weight: 600;
          color: #667eea;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(20px);
          font-size: 0.85rem;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .category-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .category-btn.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-color: transparent;
        }

        .category-icon {
          display: flex;
          align-items: center;
        }

        .category-group {
          position: relative;
          display: inline-block;
        }

        .category-filter {
          position: relative;
          display: inline-block;
        }

        .category-filter.with-dropdown .category-button {
          padding-right: 2.5rem;
        }

        .category-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          border: none;
          border-radius: 50px;
          padding: 0.7rem 1.2rem;
          color: #666;
          font-weight: 500;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          position: relative;
          min-width: 120px;
          justify-content: center;
        }

        .category-button svg {
          color: #7E72B5;
        }

        .category-button:hover {
          background: #f8f9fa;
        }

        .category-button.active {
          background: #7E72B5;
          color: white;
        }

        .category-button.active svg {
          color: white;
        }

        .dropdown-arrow {
          position: absolute;
          right: 0.8rem;
          color: #7E72B5;
          transition: transform 0.2s ease;
          width: 16px !important;
          height: 16px !important;
        }

        .category-button.active .dropdown-arrow {
          color: white;
        }

        .dropdown-arrow.open {
          transform: rotate(180deg);
        }

        .dropdown-menu {
          position: absolute;
          top: calc(100% + 0.3rem);
          left: 0;
          min-width: 100%;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          padding: 0.4rem;
          z-index: 1000;
          animation: slideDown 0.2s ease-out;
        }

        .dropdown-item {
          width: 100%;
          text-align: left;
          padding: 0.6rem 1rem;
          border: none;
          background: none;
          color: #666;
          font-weight: 500;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s ease;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          white-space: nowrap;
        }

        .dropdown-item:hover {
          background: #f8f9fa;
          color: #7E72B5;
        }

        .dropdown-item.active {
          background: #7E72B5;
          color: white;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Real Estate Filters */
        .real-estate-filters {
          padding: 1rem 2rem;
          margin: 0 1rem;
          background: rgba(255,255,255,0.95);
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.2);
        }

        .filter-chips {
          display: flex;
          gap: 0.8rem;
          flex-wrap: wrap;
        }

        .filter-chip {
          padding: 0.6rem 1.2rem;
          border-radius: 50px;
          border: 1px solid #e0e0e0;
          background: white;
          color: #666;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .filter-chip:hover {
          border-color: #7E72B5;
          color: #7E72B5;
          transform: translateY(-1px);
        }

        .filter-chip.active {
          background: #7E72B5;
          color: white;
          border-color: #7E72B5;
        }

        .active-indicator {
          font-size: 0.8rem;
          margin-left: 0.2rem;
        }

        /* Sort Options */
        .sort-container {
          display: flex;
          align-items: center;
          margin-left: 0.5rem;
          gap: 0.5rem;
        }

        .subcategory-select {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
          border-color: rgba(255,255,255,0.4);
        }

        .subcategory-select option {
          background: white;
          color: #333;
        }

        .sort-select {
          background: rgba(255,255,255,0.9);
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 20px;
          padding: 0.6rem 1rem;
          font-weight: 600;
          color: #667eea;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(20px);
          font-size: 0.85rem;
          outline: none;
          min-width: 100px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .sort-select:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .sort-select:focus {
          border-color: #667eea;
        }

        /* Products Section */
        .products-section,
        .recently-viewed-section {
          background: rgba(255,255,255,0.95);
          margin: 1rem;
          border-radius: 30px;
          padding: 3rem 1rem;
          backdrop-filter: blur(20px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          max-width: 100%;
          overflow-x: hidden;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #333;
          margin-bottom: 1rem;
        }

        .section-line {
          width: 100px;
          height: 4px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 2px;
          margin: 0 auto;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          animation: fadeInUp 0.8s ease-out;
          justify-items: stretch;
          max-width: 100%;
        }

        .product-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          border: 1px solid rgba(0,0,0,0.05);
          animation: slideInUp 0.6s ease-out both;
          width: 100%;
          min-height: 400px;
          max-width: 320px;
        }

        .product-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
        }

        .product-image-container {
          position: relative;
          height: 220px;
          overflow: hidden;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .product-card:hover .product-image {
          transform: scale(1.1);
        }

        .wishlist-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 44px;          height: 50px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.8);
          background: rgba(255,255,255,0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          color: #666;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          z-index: 10;
          padding:4px;
        }

        .wishlist-btn:hover {
          background: white;
          transform: scale(1.1);
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
          border-color: white;
          color: #ff6b6b;
        }

        .wishlist-btn.active {
          color: #ff6b6b;
          background: white;
          border-color: #ff6b6b;
          box-shadow: 0 4px 20px rgba(255,107,107,0.3);
        }

        .out-of-stock-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .product-info {
          padding: 1.5rem;
        }

        .product-category {
          display: inline-block;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 0.3rem 0.8rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 0.8rem;
        }

        .product-name {
          font-size: 1.2rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }

        .product-price {
          font-size: 1.4rem;
          font-weight: 800;
          color: #667eea;
          margin-bottom: 1rem;
        }

        .product-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .add-to-cart-btn {
          width: 100%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 12px 12px 4px 4px;
          padding: 0.8rem 1rem;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .buy-now-btn {
          width: 100%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 4px 4px 12px 12px;
          padding: 0.8rem 1rem;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .add-to-cart-btn:hover:not(.disabled),
        .buy-now-btn:hover:not(.disabled) {
          transform: translateY(-2px);
          background: linear-gradient(135deg, #5a67d8, #6b46c1);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .add-to-cart-btn.disabled,
        .buy-now-btn.disabled {
          background: #ccc;
          cursor: not-allowed;
          opacity: 0.6;
        }



        /* Enhanced Cart Controls */
        .cart-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f8f9fa;
          border-radius: 12px;
          padding: 0.5rem;
          gap: 0.5rem;
        }

        .cart-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cart-btn.minus {
          background: #ff6b6b;
          color: white;
        }

        .cart-btn.minus:hover {
          background: #ff5252;
          transform: scale(1.05);
        }

        .cart-btn.plus {
          background: #51cf66;
          color: white;
        }

        .cart-btn.plus:hover:not(:disabled) {
          background: #40c057;
          transform: scale(1.05);
        }

        .cart-btn.plus:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .cart-btn.remove {
          background: #ff6b6b;
          color: white;
          font-size: 0.9rem;
        }

        .cart-btn.remove:hover {
          background: #ff5252;
          transform: scale(1.05);
        }

        .cart-quantity {
          flex: 1;
          text-align: center;
          font-weight: 700;
          font-size: 1.1rem;
          color: #333;
          background: white;
          border-radius: 6px;
          padding: 0.3rem;
          min-width: 40px;
        }

        /* Loading and Error States */
        .loading-state {
          text-align: center;
          padding: 4rem 2rem;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-state,
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #666;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        /* Animations */
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        /* Responsive Design */
        @media (max-width: 900px) {
          .search-container {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }
          .search-bar, .categories, .sort-container {
            max-width: 100%;
            width: 100%;
            justify-content: center;
          }
          .search-bar {
            margin-bottom: 0.5rem;
          }
        }

        .cart-qty-control {
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid #ffd600;
          border-radius: 2rem;
          background: #fff;
          padding: 0.2rem 1.2rem;
          gap: 1.2rem;
          font-size: 1.3rem;
          font-weight: 700;
          margin: 0.5rem 0 1.2rem 0;
          box-shadow: 0 2px 8px #ffd60022;
          min-width: 120px;
        }
        .qty-btn {
          background: none;
          border: none;
          color: #222;
          font-size: 1.6rem;
          font-weight: 700;
          cursor: pointer;
          padding: 0 0.5rem;
          border-radius: 50%;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 32px;
          min-height: 32px;
        }
        .qty-btn:disabled {
          color: #bbb;
          cursor: not-allowed;
        }
        .qty-btn.trash {
          color: #ff6b6b;
          font-size: 1.2rem;
          margin-left: 0.5rem;
          padding: 0;
        }
        .qty-count {
          font-size: 1.3rem;
          font-weight: 700;
          color: #222;
          min-width: 24px;
          text-align: center;
          letter-spacing: 1px;
        }
      `}</style>
    </div>
  );
};

export default Home;