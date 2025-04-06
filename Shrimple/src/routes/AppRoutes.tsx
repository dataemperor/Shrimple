import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import About from "../pages/About";
import Contact from "../pages/contact.jsx";
import Home from "../pages/Home";
import Predict from "../pages/Predict";
import SignIn from "../pages/SignIn";
import CustomSignUp from "../pages/CustomSignUp";
import Map from "../pages/Map";
import Chatbot from "../pages/Chatbot";
import ShrimpDemandPrediction from "../pages/ShrimpDemandPrediction.jsx";
import ShrimpInformation from "../pages/ShrimpInformation.tsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/predict" element={<Predict />} />
      <Route path="/SignIn" element={<SignIn />} />
      <Route path="/CustomSignUp" element={<CustomSignUp />} />
      <Route path="/Map" element={<Map />} />
      <Route path="/Chatbot" element={<Chatbot />} />
      <Route path="/ShrimpDemandPrediction" element={<ShrimpDemandPrediction />} />
      <Route path="/ShrimpInformation" element={<ShrimpInformation />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
