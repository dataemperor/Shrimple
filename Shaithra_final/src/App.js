import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Predict from './pages/Predict';
import SignUp from './pages/CustomSignUp';  // Import the SignUp page
import Navbar from './components/Navbar';
import Footer from './components/Footer';  // Import the Footer component
import Signin from './pages/SignIn' 

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/predict" element={<Predict />} />
          <Route path="/signup" element={<SignUp />} />  {/* Add SignUp Route */}
          <Route path="/signin" element={<Signin />} />
        </Routes>
        <Footer />  {/* Add Footer here */}
      </div>
    </Router>
  );
}

export default App;
