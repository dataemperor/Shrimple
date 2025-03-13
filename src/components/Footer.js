import React from "react";
import { Github, Twitter, Linkedin } from "lucide-react";
import "../styles/footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-text">
          © {new Date().getFullYear()} Shrimp Harvest Predictor. All rights reserved.
        </p>
        <div className="footer-links">
          <a href="/privacy" className="footer-link">Privacy Policy</a>
          <a href="/terms" className="footer-link">Terms of Service</a>
        </div>
        <div className="footer-socials">
          <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer">
            <Github className="social-icon" />
          </a>
          <a href="https://twitter.com/your-profile" target="_blank" rel="noopener noreferrer">
            <Twitter className="social-icon" />
          </a>
          <a href="https://linkedin.com/in/your-profile" target="_blank" rel="noopener noreferrer">
            <Linkedin className="social-icon" />
          </a>
        </div>
      </div>
    </footer>
  );
}

//add footer
export default Footer;
