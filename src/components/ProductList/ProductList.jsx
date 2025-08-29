import React, { useState, useEffect, useCallback, useMemo } from "react";
import productItems from "../../data/ProductItems";
import ModelViewer from "../ModelViewer/ModelViewer";
import "./ProductList.css";
import { motion, AnimatePresence } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';
import Shery from "sheryjs";

const qrCodeImage = "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg";

const ProductList = ({ addToWishlist, wishlist, removeFromWishlist }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageErrors, setImageErrors] = useState(new Set());
  const [showARGuide, setShowARGuide] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

  // Memoize animation variants to prevent recreation on every render
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] }
    }
  }), []);

  // Handle image loading errors
  const handleImageError = useCallback((itemId) => {
    setImageErrors(prev => new Set([...prev, itemId]));
  }, []);

  useEffect(() => {
    let cleanup;

    try {
      cleanup = Shery.makeMagnet(".product-title", {
        ease: "cubic-bezier(0.23, 1, 0.32, 1)",
        duration: 1,
      });
    } catch (error) {
      console.warn('Shery animation failed:', error);
    }

    setIsLoaded(true);

    return () => {
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, []);

  // Effect for the one-time AR guide modal
  useEffect(() => {
    const hasShownGuide = localStorage.getItem('hasShownARGuide');
    if (!hasShownGuide && isDesktop) {
      setShowARGuide(true);

      const timer = setTimeout(() => {
        setShowARGuide(false);
        localStorage.setItem('hasShownARGuide', 'true');
      }, 7000);

      return () => clearTimeout(timer);
    }
  }, [isDesktop]);

  // Effect to track screen size for desktop modal
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Memoize the product items to prevent unnecessary re-renders
  const memoizedProductItems = useMemo(() => productItems, []);

  return (
    <>
      <div className="product-header">
        <div className="text-wrapper">
          <h1 className="product-title magnet-target" style={{ color: 'white' }}>Our Products</h1>
          <motion.div
            className="title-underline"
            initial={{ width: 0 }}
            animate={{ width: "100px" }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          />
        </div>
        <p className="product-subtitle" style={{ color: 'white' }}>Explore our collection with AR technology</p>
      </div>

      <motion.section
        className="product-grid"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        {memoizedProductItems.map((item, idx) => (
          <ProductCard
            key={item.id || idx}
            item={item}
            variants={itemVariants}
            addToWishlist={addToWishlist}
            wishlist={wishlist}
            removeFromWishlist={removeFromWishlist}
            onImageError={() => handleImageError(item.id || idx)}
            hasImageError={imageErrors.has(item.id || idx)}
          />
        ))}
      </motion.section>

      <AnimatePresence>
        {showARGuide && isDesktop && (
          <motion.div
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center z-[1000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white rounded-lg p-8 max-w-sm mx-4 text-center shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              style={{
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                boxSizing: 'border-box'
              }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Experience AR!</h2>
              <p className="text-gray-600 mb-6">Scan this QR code with your mobile device to view products in your own space.</p>
              <div className="w-40 h-40 mx-auto mb-6 flex items-center justify-center rounded-lg overflow-hidden">
                <img src={qrCodeImage} alt="QR Code" className="w-full h-full object-cover" />
              </div>
              <button
                className="mt-6 px-6 py-3 rounded-full bg-black text-white font-semibold transition-colors duration-300 hover:bg-gray-800"
                onClick={() => {
                  setShowARGuide(false);
                  localStorage.setItem('hasShownARGuide', 'true');
                }}
              >
                Got It!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Extracted ProductCard component for better performance
const ProductCard = React.memo(({
  item,
  variants,
  addToWishlist,
  wishlist,
  removeFromWishlist,
  onImageError,
  hasImageError
}) => {
  return (
    <motion.div
      className="product-card"
      variants={variants}
      style={{ boxShadow: '4px 4px 0px 0px #000' }}
    >
      {!hasImageError ? (
        <LazyLoadImage
          src={item.image}
          alt={item.name || 'Product image'}
          effect="blur"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
          onError={onImageError}
          loading="lazy"
          placeholder={<div className="image-placeholder">Loading...</div>}
        />
      ) : (
        <div className="image-error-placeholder">
          <span>Image unavailable</span>
        </div>
      )}

      <ModelViewer
        item={item}
        addToWishlist={addToWishlist}
        wishlist={wishlist}
        removeFromWishlist={removeFromWishlist}
      />
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductList;