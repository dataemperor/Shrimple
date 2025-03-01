import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Predict from './pages/Predict';
import SignUp from './pages/SignUp';  // Import the SignUp page
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Predict />} />
        <Route path="/signup" element={<SignUp />} />  {/* Add SignUp Route */}
      </Routes>
    </Router>
  );
}

export default App;
