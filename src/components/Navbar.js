import React from 'react';
import { Link } from 'react-router-dom';


function Navbar() {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>Shrimp Predictor</div>
      <ul style={styles.links}>
        <li><Link to="/predict-ground" style={styles.link}>Home</Link></li>
        <li><Link to="/" style={styles.link}>Predict</Link></li>
        <li><Link to="/signup">Sign Up</Link></li>
        
        
      </ul>
    </nav>
  );
}

const styles = {

  logo: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  links: {
    display: "flex",
    gap: "20px",
    listStyleType: "none",
    margin: 0,
    padding: 0,
  },
  link: {
    textDecoration: "none",
    color: "white",
    fontSize: "18px",
  },
  
  
};

export default Navbar;
