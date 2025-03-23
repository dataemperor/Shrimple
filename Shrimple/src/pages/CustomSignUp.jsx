import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, Lock, User, Loader2, ArrowRight } from "lucide-react";
import "../styles/custom-signup.css";
import { toast } from "sonner";
import shrimpleLogo from "../assets/shrimple-logo.png"


const CustomSignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [emailExistsError, setEmailExistsError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    const newErrors = {
      name: !formData.name.trim(),
      email: !formData.email.trim(),
      password: !formData.password.trim(),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setErrors((prev) => ({ ...prev, password: true }));
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:5000/signup", formData);
      toast.success("Account created successfully!");
      navigate("/signin");
    } catch (error) {
      // Handle duplicate email error
      if (error.response?.data?.message === "User already exists") {
        setEmailExistsError(true); 
        setErrors((prev) => ({ ...prev, email: true }));
      } else {
        toast.error(error.response?.data?.message || "Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="custom-signup-container">
      <div className="custom-signup-card">
        <div className="custom-signup-header">
          <Link to="/" className="navbar-logo-su">
            <img
              src={require("../assests/shrimple-logo.png")}
              alt="Shrimple Logo"
              className="logo-image-su"
            />
          </Link>
          <h2 className="custom-signup-title">Create Account</h2>
          <p className="custom-signup-subtitle">
            Join Shrimple for better aquaculture insights
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
                className={`custom-input-field ${errors.name ? "error-class" : ""}`}
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
                className={`custom-input-field ${errors.email ? "error-class" : ""}`}
              />
            </div>
            {emailExistsError && <p className="error-message">This email is already registered. Try signing in.</p>}
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
                className={`custom-input-field ${errors.password ? "error-class" : ""}`}
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
