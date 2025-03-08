import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Loader2, ArrowRight } from "lucide-react";
import "../styles/custom-signup.css";
import { toast } from "sonner";


const CustomSignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Account created successfully!");
    navigate("/signin");
    setLoading(false);
  };

  return (
    
      <div className="custom-signup-container">
        <div className="custom-signup-card">
        <div className="custom-signup-header">
      {/* Logo with your custom image */}
      <Link to="/" className="navbar-logo-su">
        <img
          src={require("../assests/shrimple-logo.png")} // Replace with the actual path to your logo
          alt="Shrimple Logo"
          className="logo-image-su"
        />
      </Link>
      <h2 className="custom-signup-title">Create Account</h2>
      <p className="custom-signup-subtitle">
        Join ShrimpSense for better aquaculture insights
      </p>
    </div>

          <form onSubmit={handleSubmit} className="custom-signup-form">
            <div className="custom-input-group">
              <label htmlFor="name" className="custom-input-label">
                Full Name
              </label>
              <div className="custom-input-container">
                <User className="custom-input-icon" size={18} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="custom-input-field"
                />
              </div>
            </div>

            <div className="custom-input-group">
              <label htmlFor="email" className="custom-input-label">
                Email Address
              </label>
              <div className="custom-input-container">
                <Mail className="custom-input-icon" size={18} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="custom-input-field"
                />
              </div>
            </div>

            <div className="custom-input-group">
              <label htmlFor="password" className="custom-input-label">
                Password
              </label>
              <div className="custom-input-container">
                <Lock className="custom-input-icon" size={18} />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="custom-input-field"
                />
              </div>
            </div>

            <button
              type="submit"
              className="custom-signup-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={18} className="btn-icon" />
                </>
              )}
            </button>
          </form>

          <div className="custom-signup-footer">
            <p>Already have an account?</p>
            <Link to="/signin" className="custom-signin-link">
              <span>Sign In</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    
  );
};

export default CustomSignUp;
