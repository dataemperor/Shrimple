import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Predict from './pages/Predict';
import SignUp from './pages/CustomSignUp';  
import Navbar from './components/Navbar';
import Footer from './components/Footer';  
import Signin from './pages/SignIn' 

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/predict" element={<Predict />} />
          <Route path="/signup" element={<SignUp />} /> 
          <Route path="/signin" element={<Signin />} />
        </Routes>
        <Footer />  
      </div>
    </Router>
  );
}

export default App;
