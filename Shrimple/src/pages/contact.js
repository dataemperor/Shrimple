import React, { useState } from "react";
import { Phone, Mail, MapPin, Globe, ArrowRight, Sparkles } from "lucide-react";
import "../styles/contact.css";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    inquiryType: "",
    message: "",
  });
  
  
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    
    
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      inquiryType: "",
      message: "",
    });
  };
  
  return (
    <div className="contact-container">
      <div className="content">
        {/* Header */}
        <div className="header">
          <h1 className="title">Get in Touch with Us</h1>
          <p className="subtitle">
          Have questions about shrimp harvesting ground predictions?
          Need technical support or partnership opportunities? Reach out to our dedicated team and let us assist you with precision insights and innovative solutions for sustainable shrimp harvesting.
          </p>
        </div>
        
        {/* Main content grid */}
        <div className="two-column">
          {/* Contact form card */}
          <div className="card">
            <div className="card-header">
              <Sparkles className="sparkle-icon" />
              <h2 className="card-title">Send Us a Message</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label className="label">Your Name</label>
                <div className="input-container">
                  <Phone className="icon" size={18} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="input"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="label">Your Email</label>
                <div className="input-container">
                  <Mail className="icon" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="input"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="label">Inquiry Type</label>
                <div className="input-container">
                  <Globe className="icon" size={18} />
                  <select
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    className="input"
                    required
                  >
                    <option value="" disabled>Select Inquiry Type</option>
                    <option value="technical">Technical Support</option>
                    <option value="partnership">Partnership Inquiry</option>
                    <option value="assessment">Chemical Risk Assessment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label className="label">Your Message</label>
                <div className="input-container">
                  <MapPin className="icon" size={18} />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here"
                    rows={5}
                    className="input"
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="submit-btn"
              >
                Send Message
                <ArrowRight className="arrow-icon" size={18} />
              </button>
            </form>
          </div>
          
          {/* Contact information card */}
          <div className="card info-card">
            <div className="card-header">
              <h2 className="card-title">Contact Information</h2>
            </div>
            
            <div className="info-box">
              <div className="info-label">
                <MapPin size={20} />
                <span>Our Address</span>
              </div>
              <div className="address">
                SHRIMPLE<br />
                "Lakshman Building" 6th Floor,<br />
                No. 321, Galle Road,<br />
                Colombo 03, Sri Lanka.
              </div>
              
              <p><strong>Phone:</strong> +94 112437149</p>
              <p><strong>Fax:</strong> +94 112437149</p>
              <p><strong>Email:</strong> info@shrimp.lk</p>
            </div>
            
            <div className="help-box">
              <div className="emoji">🤝</div>
              <h3 className="help-title">We're here to help</h3>
              <p className="help-text">Our team is ready to assist you with any questions or concerns.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;