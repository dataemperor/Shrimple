import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Activity, UserPlus, LogIn, Menu, X } from "lucide-react";
import "../styles/custom-navbar.css";

const CustomNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const navLinks = [
    { path: "/", label: "Home", icon: <Home size={18} /> },
    { path: "/predict", label: "Prediction", icon: <Activity size={18} /> },
    { path: "/signup", label: "Sign Up", icon: <UserPlus size={18} /> },
    { path: "/Datainsights", label: "Data Insights", icon: <LogIn size={18} /> },
    { path: "/contact", label: "Contact Us", icon: <UserPlus size={18} /> }
  ];
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  return (
    <nav className={`custom-navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo with your custom image */}
        <Link to="/" className="navbar-logo">
          <img
            src={require("../assests/shrimple-logo.png")} // Replace this path with the actual path to your logo
            alt="Shrimple Logo"
            className="logo-image"
          />
          <span className="logo-text">Shrimple</span>
        </Link>
        
        {/* Desktop Menu */}
        <ul className="navbar-links">
          {navLinks.map(({ path, label, icon }) => (
            <li key={path}>
              <Link 
                to={path} 
                className={`navbar-link ${location.pathname === path ? 'active' : ''}`}
              >
                {icon}
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
        
        {/* Mobile Menu Toggle */}
        <button className="menu-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          {navLinks.map(({ path, label, icon }) => (
            <Link
              key={path}
              to={path}
              className={`mobile-link ${location.pathname === path ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {icon}
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

//return
export default CustomNavbar;
