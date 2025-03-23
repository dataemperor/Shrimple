import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import "../styles/custom-signup.css";
import { toast } from "sonner";
import axios from "axios";
import shrimpleLogo from "../assets/shrimple-logo.png";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [passwordError, setPasswordError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    const newErrors = {
      email: !formData.email.trim(),
      password: !formData.password.trim(),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post("http://localhost:5000/signin", formData);
      localStorage.setItem("user", JSON.stringify(data));
      toast.success("Login successful!");
      navigate("/predict");
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message === "Invalid credentials") {
        // Specific handling for incorrect password or credentials
        setPasswordError(true);
        toast.error("Incorrect password. Please try again.");
      } else {
        toast.error("Something went wrong. Please try again later.");
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
              src={shrimpleLogo}
              alt="Shrimple Logo"
              className="logo-image-su"
            />
          </Link>
          <h2 className="custom-signup-title">Sign In</h2>
          <p className="custom-signup-subtitle">
            Welcome back to Shrimple
          </p>
        </div>

        <form onSubmit={handleSubmit} className="custom-signup-form">
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
                placeholder="Enter your password"
                className={`custom-input-field ${passwordError  ? "error-class" : ""}`}
              />
            </div>
            {passwordError && <p className="error-message">Incorrect password. Please try again.</p>}
          </div>

          <button
            type="submit"
            className="custom-signup-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={18} className="btn-icon" />
              </>
            )}
          </button>
        </form>

        <div className="custom-signup-footer">
          <p>Don't have an account?</p>
          <Link to="/signup" className="custom-signin-link">
            <span>Create Account</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
    
  );
};

export default SignIn;