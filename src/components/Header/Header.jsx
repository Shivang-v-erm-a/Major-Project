// src/components/Header.js

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Shery from "sheryjs";
import { toast } from "react-toastify";
import { FiHome, FiShoppingBag, FiStar, FiInfo, FiMail, FiMessageCircle, FiLogOut, FiUserPlus, FiLogIn, FiMenu, FiX } from "react-icons/fi";
import { TbAugmentedReality } from "react-icons/tb";

const Header = ({ currentUser, setCurrentUser }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    Shery.makeMagnet(".brand-title", {
      ease: "cubic-bezier(0.23, 1, 0.32, 1)",
      duration: 0.8,
    });

    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigationLinks = [
    { label: "Home", Path: "/", icon: <FiHome /> },
    { label: "Products", Path: "/product", icon: <FiShoppingBag /> },
    { label: "Wishlist", Path: "/wishlist", icon: <FiStar /> },
    { label: "About", Path: "/about", icon: <FiInfo /> },
    { label: "Contact", Path: "/contact", icon: <FiMail /> },
    { label: "Feedback", Path: "/feedback", icon: <FiMessageCircle /> },
  ];

  const handleSignOut = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    toast.info("You have been signed out.");
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-lg py-2" : "bg-white py-4"
      }`}
    >
      <nav className="flex items-center justify-between px-5 md:px-20">
        {/* Brand on the left */}
        <Link
          to="/"
          className="brand-title font-bold text-xl text-gray-900 hover:scale-105 transition-transform mr-auto flex items-center gap-2"
        >
          <TbAugmentedReality className="text-3xl" />
          <span className="text-black">AR</span><span className="text-gray-900">Shopsy</span>
        </Link>

        {/* Navigation links for desktop */}
        <ul className="hidden md:flex gap-8 items-center flex-1 justify-center">
          {navigationLinks.map((item, idx) => (
            <li key={idx}>
              <Link
                to={item.Path}
                className="flex items-center gap-2 p-2 rounded-full text-gray-700 font-medium hover:bg-black hover:text-white transition-all duration-300"
              >
                {item.icon}
                <span className="relative">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Auth buttons for desktop */}
        <div className="hidden md:flex items-center gap-4 ml-auto">
          {currentUser ? (
            <>
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white font-semibold text-sm">
                {currentUser.name
                  ? currentUser.name.charAt(0).toUpperCase()
                  : currentUser.email.charAt(0).toUpperCase()}
              </span>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 rounded-full border border-black text-black font-medium flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-300"
              >
                <FiLogOut /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/sign-in"
                className="px-4 py-2 rounded-full border border-black text-black font-medium flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-300"
              >
                <FiLogIn /> Sign In
              </Link>
              <Link
                to="/sign-up"
                className="px-4 py-2 rounded-full bg-black text-white font-medium flex items-center gap-2 hover:bg-gray-800 hover:scale-105 transition-all duration-300"
              >
                <FiUserPlus /> Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-900">
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu content */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white transition-all duration-330 overflow-hidden ${
          isMobileMenuOpen ? "h-auto p-4 shadow-lg" : "h-0 p-0"
        }`}
      >
        <ul className="flex flex-col gap-4 items-center">
          {navigationLinks.map((item, idx) => (
            <li key={idx}>
              <Link
                to={item.Path}
                className="flex items-center gap-2 p-2 rounded-full text-gray-700 font-medium hover:bg-black hover:text-white transition-all duration-300 w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.icon}
                <span className="relative">{item.label}</span>
              </Link>
            </li>
          ))}
          <li className="w-full h-px bg-gray-200 my-2"></li> {/* Separator */}
          <div className="flex flex-col gap-4 items-center w-full">
            {currentUser ? (
              <>
                <div className="flex items-center gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white font-semibold text-sm">
                    {currentUser.name
                      ? currentUser.name.charAt(0).toUpperCase()
                      : currentUser.email.charAt(0).toUpperCase()}
                  </span>
                  <span>{currentUser.name || currentUser.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 rounded-full border border-black text-black font-medium flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all duration-300"
                >
                  <FiLogOut /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/sign-in"
                  className="w-full px-4 py-2 rounded-full border border-black text-black font-medium flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiLogIn /> Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="w-full px-4 py-2 rounded-full bg-black text-white font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiUserPlus /> Sign Up
                </Link>
              </>
            )}
          </div>
        </ul>
      </div>
    </header>
  );
};

export default Header;