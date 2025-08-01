import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartWithSync } from '../utils/cartUtils';
import { addWishlistItem, removeWishlistItem } from '../../redux/wishlistSlice';
import { addRecentlyViewed } from '../../redux/userSlice';
import { Heart } from 'lucide-react';
import { Star, X } from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL;
const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const wishlist = useSelector(state => state.wishlist.items);
  const user = useSelector(state => state.user.user);

  // Similar Products Component
  const SimilarProducts = ({ currentProduct }) => {
    const [similarProducts, setSimilarProducts] = useState([]);
    const [loadingSimilar, setLoadingSimilar] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
      const fetchSimilarProducts = async () => {
        try {
          const response = await fetch(`${API_URL}/api/products/similar/${currentProduct._id}?category=${currentProduct.category}&limit=4`);
          if (response.ok) {
            const data = await response.json();
            setSimilarProducts(data);
          }
        } catch (error) {
          console.error('Error fetching similar products:', error);
        } finally {
          setLoadingSimilar(false);
        }
      };

      if (currentProduct) {
        fetchSimilarProducts();
      }
    }, [currentProduct]);

    const handleProductClick = (productId) => {
      navigate(`/product/${productId}`);
    };

    const handleAddToCart = (product) => {
      addToCartWithSync(dispatch, user, product, 1);
    };

    const handleWishlist = (productId) => {
      const isInWishlist = wishlist.some(item => item.product && (item.product._id === productId || item.product === productId));
      if (isInWishlist) {
        dispatch(removeWishlistItem({ itemId: productId, token: user?.token }));
      } else {
        dispatch(addWishlistItem({ productId, token: user?.token }));
      }
    };

    if (loadingSimilar) {
      return (
        <div style={styles.similarSection}>
          <h2 style={styles.similarTitle}>Similar Products</h2>
          <div style={styles.similarGrid}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={styles.similarCardSkeleton}>
                <div style={styles.skeletonImage}></div>
                <div style={styles.skeletonContent}>
                  <div style={styles.skeletonTitle}></div>
                  <div style={styles.skeletonPrice}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (similarProducts.length === 0) {
      return null;
    }

    return (
      <div style={styles.similarSection}>
        <h2 style={styles.similarTitle}>Similar Products</h2>
        <div style={styles.similarGrid}>
          {similarProducts.map((product) => (
            <div 
              key={product._id} 
              style={styles.similarCard}
              onClick={() => handleProductClick(product._id)}
            >
              <div style={styles.similarImageContainer}>
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  style={styles.similarImage}
                />
                <button
                  style={{
                    ...styles.similarHeartBtn,
                    color: wishlist.some(item => item.product && (item.product._id === product._id || item.product === product._id)) ? '#f472b6' : '#a78bfa'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWishlist(product._id);
                  }}
                >
                  <Heart 
                    fill={wishlist.some(item => item.product && (item.product._id === product._id || item.product === product._id)) ? '#f472b6' : 'none'} 
                    size={18} 
                  />
                </button>
              </div>
              <div style={styles.similarContent}>
                <h3 style={styles.similarProductName}>{product.name}</h3>
                <p style={styles.similarCategory}>{product.category}</p>
                <p style={styles.similarPrice}>₹{Number(product.price).toLocaleString('en-IN')}</p>
                <button
                  style={styles.similarAddToCartBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
        // Add to recently viewed
        dispatch(addRecentlyViewed(data));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, dispatch]);

  useEffect(() => {
    console.log('Product:', product);
    console.log('Error:', error);
    console.log('Loading:', loading);
  }, [product, error, loading]);

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

  const handleAddToCart = () => {
    if (quantity < 1 || quantity > product.stock) return;
    addToCartWithSync(dispatch, user, product, quantity);
  };

  const handleBuyNow = () => {
    if (!user) {
      alert('Please log in to continue with purchase');
      return;
    }
    if (quantity < 1 || quantity > product.stock) return;
    
    // Add to cart and redirect to checkout
    addToCartWithSync(dispatch, user, product, quantity);
    navigate('/checkout');
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      prevImage();
    } else if (e.key === 'ArrowRight') {
      nextImage();
    }
  };

  const openReviewForm = () => {
    if (!user) {
      alert('Please log in to write a review');
      return;
    }
    setShowReviewForm(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission
    if (!user) {
      alert('Please log in to submit a review');
      return;
    }
    if (reviewRating === 0) {
      alert('Please select a rating');
      return;
    }
    if (!reviewComment.trim()) {
      alert('Please write a review comment');
      return;
    }
    setSubmittingReview(true);
    try {
          const response = await fetch(`${API_URL}/api/products/${product._id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment.trim()
        })
      });
      if (response.ok) {
        const updatedProduct = await response.json();
        setProduct(updatedProduct);
        setShowReviewForm(false);
        setReviewRating(0);
        setReviewComment('');
        alert('Review submitted successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div style={styles.loading}>Loading product...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;
  if (!product) return <div style={styles.error}>Product not found.</div>;

  return (
    <div style={styles.bg}>
      <div style={styles.container}>
        <div style={styles.imageSection}>
          <div style={styles.mainImageContainer} onKeyDown={handleKeyDown} tabIndex={0}>
            <img 
              src={product.images[selectedImageIndex]} 
              alt={product.name} 
              style={styles.mainImage} 
            />
            {product.images.length > 1 && (
              <>
                <div style={styles.imageCounter}>
                  {selectedImageIndex + 1} of {product.images.length}
                </div>
                <button 
                  style={styles.arrowBtn} 
                  onClick={prevImage}
                  aria-label="Previous image"
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 1)';
                    e.target.style.transform = 'translateY(-50%) scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                    e.target.style.transform = 'translateY(-50%) scale(1)';
                  }}
                >
                  ‹
                </button>
                <button 
                  style={{...styles.arrowBtn, right: 12}} 
                  onClick={nextImage}
                  aria-label="Next image"
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 1)';
                    e.target.style.transform = 'translateY(-50%) scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                    e.target.style.transform = 'translateY(-50%) scale(1)';
                  }}
                >
                  ›
                </button>
              </>
            )}
            {product.images.length > 1 && (
              <div 
                style={styles.thumbnailContainer} 
                className="thumbnail-scrollbar"
                onMouseDown={(e) => {
                  e.preventDefault();
                  const container = e.currentTarget;
                  const startX = e.pageX - container.offsetLeft;
                  const scrollLeft = container.scrollLeft;
                  container.style.cursor = 'grabbing';
                  
                  const handleMouseMove = (e) => {
                    const x = e.pageX - container.offsetLeft;
                    const walk = (x - startX) * 2;
                    container.scrollLeft = scrollLeft - walk;
                  };
                  
                  const handleMouseUp = () => {
                    container.style.cursor = 'grab';
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };
                  
                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
                onWheel={(e) => {
                  e.preventDefault();
                  e.currentTarget.scrollLeft += e.deltaY;
                }}
              >
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    style={{
                      ...styles.thumbnail,
                      border: selectedImageIndex === index ? '3px solid #a78bfa' : '2px solid #e5e7eb',
                      opacity: selectedImageIndex === index ? 1 : 0.7,
                      userSelect: 'none',
                    }}
                    onClick={(e) => {
                      // Small delay to prevent conflicts with drag scrolling
                      setTimeout(() => {
                        setSelectedImageIndex(index);
                      }, 10);
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = 1}
                    onMouseLeave={(e) => e.target.style.opacity = selectedImageIndex === index ? 1 : 0.7}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <div style={styles.info}>
          <h1 style={styles.name}>{product.name}
            <button
              style={{ ...styles.heartBtn, color: isInWishlist(product._id) ? '#f472b6' : '#a78bfa', marginLeft: 12, verticalAlign: 'middle' }}
              onClick={() => handleWishlist(product._id)}
              aria-label={isInWishlist(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
              tabIndex={0}
            >
              <Heart fill={isInWishlist(product._id) ? '#f472b6' : 'none'} size={22} />
            </button>
          </h1>
          <p style={styles.category}>{product.category}</p>
          <p style={styles.price}>₹{Number(product.price).toLocaleString('en-IN')}</p>
          <p style={styles.desc}>{product.description}</p>
          <div style={styles.cartRow}>
            <input
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={e => {
                let val = Number(e.target.value);
                if (val < 1) val = 1;
                if (val > product.stock) val = product.stock;
                setQuantity(val);
              }}
              style={styles.qtyInput}
            />
            <div style={styles.buttonGroup}>
              <button 
                style={styles.cartBtn} 
                onClick={handleAddToCart} 
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button 
                style={styles.buyNowBtn} 
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                Buy Now
              </button>
            </div>
          </div>
          <p style={styles.stock}>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
          
          {/* Review Section */}
          <div style={styles.reviewSection}>
            <h3 style={styles.reviewTitle}>Customer Reviews</h3>
            {product.rating && product.reviewCount ? (
              <div style={styles.ratingDisplay}>
                <div style={styles.stars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} style={star <= product.rating ? styles.filledStar : styles.emptyStar}>
                      ★
                    </span>
                  ))}
                </div>
                <span style={styles.ratingText}>
                  {product.rating.toFixed(1)} out of 5 ({product.reviewCount} reviews)
                </span>
              </div>
            ) : (
              <p style={styles.noReviews}>No reviews yet</p>
            )}
            <div style={styles.reviewButtons}>
              <button style={styles.viewReviewsBtn} onClick={() => setShowReviewForm(true)}>
                View Reviews ({product.reviewCount || 0})
              </button>
              <button style={styles.reviewBtn} onClick={openReviewForm}>
                Write a Review
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Similar Products Section */}
      <SimilarProducts currentProduct={product} />
      
             {/* Review Form Modal */}
       {showReviewForm && (
         <div style={styles.modalOverlay}>
           <div style={styles.modalContent}>
             <div style={styles.modalHeader}>
               <h3 style={styles.modalTitle}>Write a Review</h3>
               <button 
                 style={styles.closeBtn} 
                 onClick={() => setShowReviewForm(false)}
                 disabled={submittingReview}
                 type="button"
               >
                 <X size={20} />
               </button>
             </div>
             <div style={styles.modalBody}>
               <div style={styles.productInfo}>
                 <img src={product.images[0]} alt={product.name} style={styles.productThumbnail} />
                 <div>
                   <h4 style={styles.productName}>{product.name}</h4>
                   <p style={styles.productCategory}>{product.category}</p>
                 </div>
               </div>
               <div style={styles.ratingSection}>
                 <label style={styles.ratingLabel}>Your Rating:</label>
                 <div style={styles.starRating}>
                   {[1, 2, 3, 4, 5].map((star) => (
                     <button
                       key={star}
                       style={styles.starBtn}
                       onClick={() => setReviewRating(star)}
                       type="button"
                       disabled={submittingReview}
                     >
                       <Star
                         size={24}
                         fill={star <= reviewRating ? '#ffd700' : 'none'}
                         stroke={star <= reviewRating ? '#ffd700' : '#ddd'}
                         strokeWidth={2}
                       />
                     </button>
                   ))}
                 </div>
                 <span style={styles.ratingText}>
                   {reviewRating > 0 ? `${reviewRating} star${reviewRating > 1 ? 's' : ''}` : 'Select a rating'}
                 </span>
               </div>
               <div style={styles.commentSection}>
                 <label style={styles.commentLabel}>Your Review:</label>
                 <textarea
                   style={styles.commentInput}
                   placeholder="Share your experience with this product..."
                   value={reviewComment}
                   onChange={(e) => setReviewComment(e.target.value)}
                   onKeyDown={(e) => {
                     if (e.key === 'Enter' && e.ctrlKey) {
                       e.preventDefault();
                       handleReviewSubmit(e);
                     }
                   }}
                   rows={4}
                   maxLength={500}
                   disabled={submittingReview}
                 />
                 <span style={styles.charCount}>
                   {reviewComment.length}/500 characters
                 </span>
               </div>
             </div>
             <div style={styles.modalFooter}>
               <button 
                 style={styles.cancelBtn} 
                 onClick={() => setShowReviewForm(false)}
                 disabled={submittingReview}
                 type="button"
               >
                 Cancel
               </button>
               <button 
                 style={styles.submitBtn} 
                 onClick={handleReviewSubmit}
                 disabled={submittingReview || reviewRating === 0 || !reviewComment.trim()}
                 type="button"
               >
                 {submittingReview ? 'Submitting...' : 'Submit Review'}
               </button>
             </div>
           </div>
         </div>
       )}
      
      <style>{`
        .thumbnail-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .thumbnail-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 3px;
        }
        .thumbnail-scrollbar::-webkit-scrollbar-thumb {
          background: #a78bfa;
          border-radius: 3px;
        }
        .thumbnail-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #8b5cf6;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .similarCard:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        
        .similarCard:hover .similarImage {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

const styles = {
  bg: {
    minHeight: '100vh',
    background: '#fff',
    fontFamily: 'Montserrat, sans-serif',
    padding: '2rem 0',
    paddingTop: '6rem',
    width: '100%',
    maxWidth: '100%',
    overflowX: 'hidden',
  },
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    gap: 40,
    alignItems: 'flex-start',
    background: '#f9f9fb',
    borderRadius: 24,
    boxShadow: '0 2px 16px #e5e7eb',
    padding: 32,
    width: '100%',
    boxSizing: 'border-box',
  },
  imageSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    minWidth: 400,
    maxWidth: 500,
  },
  mainImageContainer: {
    position: 'relative',
    background: '#fff',
    borderRadius: 16,
    padding: 20,
    boxShadow: '0 2px 8px #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 400,
    height: 400,
    flexShrink: 0,
  },
  mainImage: {
    maxWidth: 360,
    maxHeight: 360,
    width: 'auto',
    height: 'auto',
    objectFit: 'contain',
    borderRadius: 8,
    cursor: 'zoom-in',
    transition: 'transform 0.2s',
  },
  thumbnailContainer: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: 12,
    overflowX: 'auto',
    padding: '8px 12px',
    scrollbarWidth: 'thin',
    scrollbarColor: '#a78bfa #f3f4f6',
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    backdropFilter: 'blur(10px)',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
    maxWidth: 360,
    cursor: 'grab',
  },
  thumbnail: {
    width: 60,
    height: 60,
    objectFit: 'cover',
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'all 0.2s',
    background: '#fff',
    padding: 2,
    flexShrink: 0,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  imageCounter: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    background: 'rgba(0, 0, 0, 0.7)',
    color: '#fff',
    padding: '4px 8px',
    borderRadius: 12,
    fontSize: '0.8rem',
    fontWeight: 600,
  },
  arrowBtn: {
    position: 'absolute',
    top: '50%',
    left: 12,
    transform: 'translateY(-50%)',
    background: 'rgba(255, 255, 255, 0.9)',
    border: 'none',
    borderRadius: '50%',
    width: 40,
    height: 40,
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  },
  thumbnailScrollbar: {
    '&::-webkit-scrollbar': {
      height: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f3f4f6',
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#a78bfa',
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#8b5cf6',
    },
  },
  info: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  name: {
    fontSize: '2rem',
    fontWeight: 800,
    color: '#a78bfa',
    margin: 0,
  },
  category: {
    color: '#f472b6',
    fontWeight: 600,
    fontSize: '1.1rem',
    margin: 0,
  },
  price: {
    fontWeight: 800,
    fontSize: '1.3rem',
    color: '#18181b',
    margin: '0.5rem 0',
  },
  desc: {
    color: '#444',
    fontSize: '1.1rem',
    margin: '1rem 0',
  },
  cartRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    margin: '1rem 0',
  },
  qtyInput: {
    width: 60,
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: 8,
    border: '1.5px solid #e5e7eb',
    textAlign: 'center',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    flex: 1,
  },
  cartBtn: {
    background: 'linear-gradient(90deg, #a78bfa, #f472b6)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px 12px 4px 4px',
    padding: '0.75rem 2rem',
    fontWeight: 700,
    fontSize: '1.1rem',
    cursor: 'pointer',
    boxShadow: '0 2px 8px #a78bfa33',
    transition: 'all 0.2s',
    outline: 'none',
    width: '100%',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px #a78bfa55',
    },
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
  },
  buyNowBtn: {
    background: 'linear-gradient(90deg, #667eea, #764ba2)',
    color: '#fff',
    border: 'none',
    borderRadius: '4px 4px 12px 12px',
    padding: '0.75rem 2rem',
    fontWeight: 700,
    fontSize: '1.1rem',
    cursor: 'pointer',
    boxShadow: '0 2px 8px #667eea33',
    transition: 'all 0.2s',
    outline: 'none',
    width: '100%',
    '&:hover': {
      transform: 'translateY(2px)',
      boxShadow: '0 4px 12px #667eea55',
    },
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
  },
  stock: {
    color: '#888',
    fontWeight: 500,
    fontSize: '1rem',
    marginTop: 8,
  },
  loading: {
    textAlign: 'center',
    color: '#a78bfa',
    fontWeight: 700,
    fontSize: '1.2rem',
    margin: '2rem 0',
    background: '#fff',
  },
  error: {
    textAlign: 'center',
    color: '#ff6b6b',
    fontWeight: 700,
    fontSize: '1.2rem',
    margin: '2rem 0',
    background: '#fff',
  },
  heartBtn: {
    background: 'rgba(255,255,255,0.8)',
    border: 'none',
    borderRadius: '50%',
    padding: 6,
    cursor: 'pointer',
    zIndex: 2,
    boxShadow: '0 2px 8px #a78bfa22',
    transition: 'background 0.2s, color 0.2s',
    outline: 'none',
    marginLeft: 8,
  },
  similarSection: {
    marginTop: 40,
    padding: '0 20px',
  },
  similarTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#a78bfa',
    marginBottom: 20,
    textAlign: 'center',
  },
  similarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: 20,
    maxWidth: 1200,
    margin: '0 auto',
  },
  similarCard: {
    background: '#fff',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 2px 8px #e5e7eb',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '1px solid #f3f4f6',
  },
  similarCardSkeleton: {
    background: '#fff',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 2px 8px #e5e7eb',
    border: '1px solid #f3f4f6',
  },
  similarImageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  similarImage: {
    width: '100%',
    height: 200,
    objectFit: 'cover',
    borderRadius: 12,
    transition: 'transform 0.2s',
  },
  skeletonImage: {
    width: '100%',
    height: 200,
    background: '#f3f4f6',
    borderRadius: 12,
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  similarHeartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    background: 'rgba(255,255,255,0.9)',
    border: 'none',
    borderRadius: '50%',
    padding: 6,
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'all 0.2s',
    zIndex: 2,
  },
  similarContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  skeletonContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginTop: 12,
  },
  similarProductName: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#1f2937',
    margin: 0,
    lineHeight: 1.3,
  },
  skeletonTitle: {
    height: 20,
    background: '#f3f4f6',
    borderRadius: 4,
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  similarCategory: {
    color: '#f472b6',
    fontWeight: 500,
    fontSize: '0.9rem',
    margin: 0,
  },
  similarPrice: {
    fontWeight: 700,
    fontSize: '1.1rem',
    color: '#1f2937',
  },
  // Review Section Styles
  reviewSection: {
    marginTop: 24,
    padding: 20,
    background: '#fff',
    borderRadius: 12,
    border: '1px solid #e5e7eb',
  },
  reviewTitle: {
    fontSize: '1.2rem',
    fontWeight: 600,
    color: '#1f2937',
    marginBottom: 16,
    margin: '0 0 16px 0',
  },
  ratingDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  stars: {
    display: 'flex',
    gap: 2,
  },
  filledStar: {
    color: '#ffd700',
    fontSize: '1.2rem',
  },
  emptyStar: {
    color: '#ddd',
    fontSize: '1.2rem',
  },
  ratingText: {
    fontSize: '0.9rem',
    color: '#6b7280',
    fontWeight: 500,
  },
  noReviews: {
    fontSize: '0.9rem',
    color: '#6b7280',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  reviewButtons: {
    display: 'flex',
    gap: 12,
    marginTop: 16,
  },
  viewReviewsBtn: {
    background: 'linear-gradient(135deg, #a78bfa, #f472b6)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '10px 20px',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    flex: 1,
  },
  reviewBtn: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '10px 20px',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    flex: 1,
  },
  skeletonPrice: {
    height: 16,
    width: '60%',
    background: '#f3f4f6',
    borderRadius: 4,
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  similarAddToCartBtn: {
    background: 'linear-gradient(90deg, #a78bfa, #f472b6)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '8px 16px',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginTop: 8,
  },
  // Modal Styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    width: '90%',
    maxWidth: 600,
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 2rem',
    borderBottom: '1px solid #e5e7eb',
    background: '#f9f9fb',
  },
  modalTitle: {
    margin: 0,
    fontSize: '1.8rem',
    fontWeight: 700,
    color: '#1f2937',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 8,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s',
  },
  modalBody: {
    padding: '2rem 2rem 1.5rem',
    overflowY: 'auto',
    flexGrow: 1,
  },
  productInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
    paddingBottom: 20,
    borderBottom: '1px solid #e5e7eb',
  },
  productThumbnail: {
    width: 80,
    height: 80,
    objectFit: 'cover',
    borderRadius: 12,
    flexShrink: 0,
  },
  productName: {
    margin: 0,
    fontSize: '1.3rem',
    fontWeight: 700,
    color: '#1f2937',
  },
  productCategory: {
    color: '#f472b6',
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  ratingSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottom: '1px solid #e5e7eb',
  },
  ratingLabel: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#1f2937',
    marginBottom: 8,
  },
  starRating: {
    display: 'flex',
    gap: 8,
    marginBottom: 8,
  },
  starBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 8,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  commentSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTop: '1px solid #e5e7eb',
  },
  commentLabel: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#1f2937',
    marginBottom: 8,
  },
  commentInput: {
    width: '100%',
    padding: '1rem',
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    fontSize: '1rem',
    lineHeight: 1.5,
    resize: 'none',
    minHeight: 100,
    boxSizing: 'border-box',
    transition: 'all 0.2s',
  },
  charCount: {
    fontSize: '0.8rem',
    color: '#6b7280',
    marginTop: 8,
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
    padding: '1.5rem 2rem',
    borderTop: '1px solid #e5e7eb',
    background: '#f9f9fb',
  },
  cancelBtn: {
    background: 'linear-gradient(90deg, #667eea, #764ba2)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '10px 20px',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  submitBtn: {
    background: 'linear-gradient(90deg, #a78bfa, #f472b6)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '10px 20px',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};

export default Product; 