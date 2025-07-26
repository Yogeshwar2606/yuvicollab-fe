import React, { useState, useEffect, useRef } from "react";
import {
  ShoppingCart,
  Sofa,
  Smartphone,
  TreePine,
  Star,
  ArrowRight,
  Menu,
  X,
  Play,
  TrendingUp,
  Award,
  Users,
  Sparkles,
  Zap,
  Heart,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [showIndicators, setShowIndicators] = useState(true); // NEW: for hiding bubbles
  const heroRef = useRef(null);

  const categories = [
    {
      icon: <Sofa size={64} />,
      title: "Premium Furniture",
      description:
        "Transform your space with our curated collection of modern and classic furniture pieces that blend luxury with functionality.",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
      color: "#fbbf24",
      accent: "amber",
    },
    {
      icon: <Smartphone size={64} />,
      title: "Latest Electronics",
      description:
        "Discover cutting-edge technology and electronics that power your digital lifestyle with innovation and style.",
      image:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop",
      color: "#06b6d4",
      accent: "blue",
    },
    {
      icon: <TreePine size={64} />,
      title: "Beautiful Landscapes",
      description:
        "Discover luxurious properties and prime real estate opportunities that redefine modern living and investment.",
      image:
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop",
      color: "#10b981",
      accent: "green",
    },
  ];

  const features = [
    {
      icon: <TrendingUp size={32} />,
      title: "Premium Quality",
      desc: "Curated selection of high-end products",
      color: "#a78bfa",
    },
    {
      icon: <Award size={32} />,
      title: "Award Winning",
      desc: "Recognized for excellence in service",
      color: "#38bdf8",
    },
    {
      icon: <Users size={32} />,
      title: "Trusted by 10K+",
      desc: "Happy customers worldwide",
      color: "#10b981",
    },
    {
      icon: <Shield size={32} />,
      title: "Secure Shopping",
      desc: "100% safe and secure transactions",
      color: "#f59e42",
    },
  ];

  const heroSlides = [
    {
      title: "Redefine Your Space",
      subtitle: "Discover Premium Furniture, Electronics & Landscapes",
             bg: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1400&h=900&fit=crop",
      overlay: "rgba(0, 0, 0, 0.1)",
    },
    {
      title: "Tech That Inspires",
      subtitle: "Latest Electronics for Modern Living",
      bg: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&h=900&fit=crop",
      overlay: "rgba(0, 120, 200, 0.3)",
    },
    {
      title: "Nature Meets Design",
      subtitle: "Beautiful Landscapes for Every Space",
      bg: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&h=900&fit=crop",
      overlay: "rgba(16, 185, 129, 0.3)",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Interior Designer",
      text: "UV's Store transformed my vision into reality. Exceptional quality and service!",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face",
    },
    {
      name: "Mike Chen",
      role: "Tech Enthusiast",
      text: "Best electronics store! Cutting-edge products with unmatched customer support.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
    },
    {
      name: "Emma Davis",
      role: "Homeowner",
      text: "The landscape collection is breathtaking. My home feels like a luxury retreat now.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3000); // CHANGED: 3 seconds
    return () => clearInterval(interval);
  }, []);

  // Hide indicators after 3 seconds
  useEffect(() => {
    setShowIndicators(true); // always show on mount/slide change
    const timeout = setTimeout(() => setShowIndicators(false), 3000);
    return () => clearTimeout(timeout);
  }, [currentSlide]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );
    const elements = document.querySelectorAll('[id^="animate-"]');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="uvs-landing-root">
      {/* Navigation */}
      <nav className="uvs-nav">
        <div className="uvs-nav-container">
          <div className="uvs-brand">
            <span className="uvs-brand-logo">UV</span>
            <span className="uvs-brand-title">UV's Store</span>
          </div>
          <div className="uvs-nav-links">
            <button className="uvs-shop-btn" onClick={() => navigate("/home")}>
              <ShoppingCart size={20} style={{ marginRight: 8 }} />
              Shop Now
            </button>
            <button
              className="uvs-login-btn"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
          <button
            className="uvs-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="uvs-mobile-menu">
            <button
              className="uvs-shop-btn"
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/home");
              }}
            >
              Shop Now
            </button>
            <button
              className="uvs-login-btn"
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/login");
              }}
            >
              Login
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="uvs-hero"
        ref={heroRef}
        style={{ backgroundImage: `url(${heroSlides[currentSlide].bg})` }}
      >
        <div
          className="uvs-hero-overlay"
          style={{ background: heroSlides[currentSlide].overlay }}
        />
        <div className="uvs-hero-content">
          <h1>{heroSlides[currentSlide].title}</h1>
          <p>{heroSlides[currentSlide].subtitle}</p>
          <div className="uvs-hero-btns">
            <button className="uvs-shop-btn" onClick={() => navigate("/home")}>
              Explore Collection <ArrowRight size={20} />
            </button>
            {/* Removed Watch Story button */}
          </div>
        </div>
        
      </section>

      {/* Features Section */}
      <section className="uvs-features-section">
        <h2>Why Choose UV's Store</h2>
        <div className="uvs-features-grid">
          {features.map((feature, idx) => (
            <div
              className="uvs-feature-card"
              key={idx}
              style={{ borderColor: feature.color }}
            >
              <div
                className="uvs-feature-icon"
                style={{ color: feature.color }}
              >
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="uvs-categories-section">
        <h2>Explore Our Universe</h2>
        <div className="uvs-categories-grid">
          {categories.map((category, idx) => (
            <div
              className="uvs-category-card"
              key={idx}
              style={{ borderColor: category.color }}
            >
              <div
                className="uvs-category-img"
                style={{ backgroundImage: `url(${category.image})` }}
              />
              <div
                className="uvs-category-icon"
                style={{ color: category.color }}
              >
                {category.icon}
              </div>
              <h3>{category.title}</h3>
              <p>{category.description}</p>
              <button
                className="uvs-shop-btn"
                onClick={() => navigate("/home")}
              >
                Shop Now <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="uvs-stats-section">
        <div className="uvs-stats-grid">
          {[
            {
              number: "50K+",
              label: "Happy Customers",
              icon: <Heart size={32} />,
            },
            {
              number: "25K+",
              label: "Products Sold",
              icon: <ShoppingCart size={32} />,
            },
            {
              number: "100+",
              label: "Premium Brands",
              icon: <Award size={32} />,
            },
            {
              number: "24/7",
              label: "Expert Support",
              icon: <Shield size={32} />,
            },
          ].map((stat, idx) => (
            <div className="uvs-stat-card" key={idx}>
              <div className="uvs-stat-icon">{stat.icon}</div>
              <div className="uvs-stat-number">{stat.number}</div>
              <div className="uvs-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="uvs-testimonials-section">
        <h2>What Our Customers Say</h2>
        <div className="uvs-testimonials-grid">
          {testimonials.map((testimonial, idx) => (
            <div className="uvs-testimonial-card" key={idx}>
              <div className="uvs-testimonial-stars">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    style={{
                      color: "#facc15",
                      marginRight: 2,
                      fill: "#facc15",
                    }}
                  />
                ))}
              </div>
              <p className="uvs-testimonial-text">"{testimonial.text}"</p>
              <div className="uvs-testimonial-user">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="uvs-testimonial-avatar"
                />
                <div>
                  <div className="uvs-testimonial-name">{testimonial.name}</div>
                  <div className="uvs-testimonial-role">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="uvs-cta-section">
        <h2>
          Ready to Transform <span>Your Space?</span>
        </h2>
        <p>
          Join thousands of satisfied customers who have transformed their homes
          with UV's Store's premium collection
        </p>
        <div className="uvs-cta-btns">
          <button className="uvs-shop-btn" onClick={() => navigate("/home")}>
            Start Shopping <ArrowRight size={20} />
          </button>
          <button className="uvs-secondary-btn">Contact Us</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="uvs-footer">
        <div className="uvs-footer-container">
          <div className="uvs-footer-brand">
            <span className="uvs-brand-logo">UV</span>
            <span className="uvs-brand-title">UV's Store</span>
            <p>
              Premium furniture, electronics, and landscapes for modern living.
              Transform your space with our curated collection of luxury
              products.
            </p>
          </div>
          <div className="uvs-footer-links">
            <div>
              <h4>Categories</h4>
              <ul>
                <li>Premium Furniture</li>
                <li>Latest Electronics</li>
                <li>Beautiful Landscapes</li>
                <li>Home Accessories</li>
                <li>Outdoor Collection</li>
              </ul>
            </div>
            <div>
              <h4>Support</h4>
              <ul>
                <li>Help Center</li>
                <li>Shipping Information</li>
                <li>Returns & Exchanges</li>
                <li>Size Guide</li>
                <li>Contact Support</li>
              </ul>
            </div>
            <div>
              <h4>Company</h4>
              <ul>
                <li>About Us</li>
                <li>Our Story</li>
                <li>Careers</li>
                <li>Press</li>
                <li>Partnerships</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="uvs-footer-bottom">
          <span>&copy; 2025 UV's Store. All rights reserved.</span>
          <span>Privacy Policy | Terms of Service | Cookie Policy</span>
        </div>
      </footer>

      {/* Component-scoped CSS */}
      <style>{`
        html, body, .uvs-landing-root { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar {
          display: none;
        }
        *, *:before, *:after { box-sizing: inherit; }
        .uvs-landing-root { font-family: 'Segoe UI', Arial, sans-serif; background: #18181b; color: #fff; width: 100%; max-width: 100%; overflow-x: hidden; }
        .uvs-nav, .uvs-nav-container, .uvs-hero, .uvs-features-section, .uvs-categories-section, .uvs-stats-section, .uvs-testimonials-section, .uvs-cta-section, .uvs-footer, .uvs-footer-container, .uvs-features-grid, .uvs-categories-grid, .uvs-stats-grid, .uvs-testimonials-grid {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          margin: 0 auto;
        }
        .uvs-nav { position: fixed; top: 0; background: #18181b; z-index: 100; border-bottom: 1px solid #222; }
        .uvs-nav-container { display: flex; align-items: center; justify-content: space-between; padding: 1rem 2vw; }
        .uvs-brand { display: flex; align-items: center; gap: 12px; }
        .uvs-brand-logo { background: linear-gradient(135deg,rgb(14, 189, 69),rgb(0, 117, 78),rgb(10, 173, 213)); color: #fff; font-weight: bold; font-size: 1.5rem; border-radius: 12px; padding: 0.5rem 1rem; }
        .uvs-brand-title { font-size: 1.5rem; font-weight: bold; background:rgb(255, 255, 255); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .uvs-nav-links { display: flex; align-items: center; gap: 2rem; }
        .uvs-nav-links a { color: #fff; text-decoration: none; font-size: 1rem; transition: color 0.2s; }
        .uvs-nav-links a:hover { color: #a78bfa; }
        .uvs-login-btn,.uvs-shop-btn { background: none; border: 2px solid #fff; color: #fff; border-radius: 16px; padding: 0.75rem 2rem; font-weight: bold; font-size: 1rem; cursor: pointer; transition: background 0.2s, color 0.2s; display: flex; align-items: center; gap: 8px; }
        .uvs-login-btn:hover ,.uvs-shop-btn:hover { background: #fff; color: #18181b; }
        .uvs-menu-btn { display: none; background: none; border: none; color: #fff; cursor: pointer; }
        .uvs-mobile-menu { display: flex; flex-direction: column; gap: 1rem; background: #18181b; padding: 1rem; }
        @media (max-width: 900px) {
          .uvs-nav-links { display: none; }
          .uvs-menu-btn { display: block; }
        }
        .uvs-hero { position: relative; min-height: 80vh; display: flex; align-items: center; justify-content: center; background-size: cover; background-position: center; background-repeat: no-repeat; margin-top: 60px; }
        .uvs-hero-overlay { position: absolute; inset: 0; z-index: 1; }
        .uvs-hero-content { position: relative; z-index: 2; text-align: center; margin: 0; padding: 0 4vw; box-sizing: border-box; }
        .uvs-hero-content h1 { font-size: 3rem; font-weight: bold; margin-bottom: 1rem; }
        .uvs-hero-content p { font-size: 1.5rem; margin-bottom: 2rem; }
        .uvs-hero-btns { display: flex; gap: 1rem; justify-content: center; }
        .uvs-secondary-btn { background: none; border: 2px solid #fff; color: #fff; border-radius: 16px; padding: 0.75rem 2rem; font-weight: bold; font-size: 1rem; cursor: pointer; transition: background 0.2s, color 0.2s; display: flex; align-items: center; gap: 8px; }
        .uvs-secondary-btn:hover { background: #fff; color: #18181b; }
        .uvs-hero-indicators { position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); display: flex; gap: 0.5rem; z-index: 2; }
        .uvs-hero-indicators button { width: 12px; height: 12px; border-radius: 50%; background: #fff; border: none; opacity: 0.5; cursor: pointer; transition: opacity 0.2s, transform 0.2s; }
        .uvs-hero-indicators button.active { opacity: 1; transform: scale(1.2); }
        .uvs-features-section { padding: 4rem 0; text-align: center; }
        .uvs-features-section h2 { font-size: 2.5rem; font-weight: bold; margin-bottom: 2rem; }
        .uvs-features-grid { display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap; }
        .uvs-feature-card { background: #23232b; border: 2px solid #a78bfa; border-radius: 1.5rem; padding: 2rem; min-width: 220px; text-align: center; transition: transform 0.2s; box-sizing: border-box; }
        .uvs-feature-card:hover { transform: translateY(-8px) scale(1.03); }
        .uvs-feature-icon { font-size: 2rem; margin-bottom: 1rem; }
        .uvs-categories-section { padding: 4rem 0; text-align: center; }
        .uvs-categories-section h2 { font-size: 2.5rem; font-weight: bold; margin-bottom: 2rem; }
        .uvs-categories-grid { display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap; }
        .uvs-category-card { background: #23232b; border: 2px solid #fbbf24; border-radius: 1.5rem; padding: 2rem; min-width: 260px; text-align: center; position: relative; transition: transform 0.2s; box-sizing: border-box; }
        .uvs-category-card:hover { transform: translateY(-8px) scale(1.03); }
        .uvs-category-img { width: 100%; height: 160px; background-size: cover; background-position: center; border-radius: 1rem; margin-bottom: 1rem; }
        .uvs-category-icon { font-size: 2rem; margin-bottom: 1rem; }
        .uvs-stats-section { padding: 4rem 0; background: #23232b; }
        .uvs-stats-grid { display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap; }
        .uvs-stat-card { background: #23232b; border-radius: 1.5rem; padding: 2rem; min-width: 180px; text-align: center; box-sizing: border-box; }
        .uvs-stat-icon { font-size: 2rem; margin-bottom: 1rem; }
        .uvs-stat-number { font-size: 2rem; font-weight: bold; margin-bottom: 0.5rem; }
        .uvs-stat-label { color: #a1a1aa; font-size: 1rem; }
        .uvs-testimonials-section { padding: 4rem 0; text-align: center; }
        .uvs-testimonials-section h2 { font-size: 2.5rem; font-weight: bold; margin-bottom: 2rem; }
        .uvs-testimonials-grid { display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap; }
        .uvs-testimonial-card { background: #23232b; border-radius: 1.5rem; padding: 2rem; min-width: 260px; text-align: center; box-sizing: border-box; }
        .uvs-testimonial-stars { display: flex; justify-content: center; margin-bottom: 1rem; }
        .uvs-testimonial-text { color: #d4d4d8; font-style: italic; font-size: 1.1rem; margin-bottom: 1rem; }
        .uvs-testimonial-user { display: flex; align-items: center; justify-content: center; gap: 1rem; }
        .uvs-testimonial-avatar { width: 48px; height: 48px; border-radius: 50%; border: 2px solid #a1a1aa; object-fit: cover; }
        .uvs-testimonial-name { font-weight: bold; color: #fff; font-size: 1rem; }
        .uvs-testimonial-role { color: #a1a1aa; font-size: 0.9rem; }
        .uvs-cta-section { padding: 4rem 0; text-align: center; background: #23232b; }
        .uvs-cta-section h2 { font-size: 2.5rem; font-weight: bold; margin-bottom: 1rem; }
        .uvs-cta-section h2 span { background: linear-gradient(90deg, #a78bfa, #f472b6, #f87171); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .uvs-cta-section p { font-size: 1.25rem; color: #a1a1aa; margin-bottom: 2rem; }
        .uvs-cta-btns { display: flex; gap: 1rem; justify-content: center; }
        .uvs-footer { background: #18181b; border-top: 1px solid #222; padding: 3rem 0 1rem 0; color: #a1a1aa; }
        .uvs-footer-container { display: flex; gap: 2rem; justify-content: space-between; flex-wrap: wrap; box-sizing: border-box; margin: 0 auto; max-width: 1400px; }
        .uvs-footer-brand { flex: 1; min-width: 220px; }
        .uvs-footer-brand .uvs-brand-logo { display: inline-block; margin-bottom: 0.5rem; }
        .uvs-footer-brand .uvs-brand-title { display: block; font-size: 1.2rem; font-weight: bold; margin-bottom: 1rem; }
        .uvs-footer-links { display: flex; gap: 2rem; flex: 2; min-width: 220px; }
        .uvs-footer-links h4 { font-size: 1.1rem; font-weight: bold; margin-bottom: 0.5rem; }
        .uvs-footer-links ul { list-style: none; padding: 0; margin: 0; }
        .uvs-footer-links li { margin-bottom: 0.5rem; }
        .uvs-footer-bottom { display: flex; justify-content: space-between; align-items: center; font-size: 0.95rem; color: #a1a1aa; border-top: 1px solid #23232b; padding-top: 1rem; margin: 2rem auto 0 auto; max-width: 1400px; }
        @media (max-width: 900px) {
          .uvs-features-grid, .uvs-categories-grid, .uvs-stats-grid, .uvs-testimonials-grid, .uvs-footer-container { flex-direction: column; align-items: center; }
          .uvs-nav-container { flex-direction: column; gap: 1rem; }
        }
      `}</style>
    </div>
  );
};

export default Landing;
