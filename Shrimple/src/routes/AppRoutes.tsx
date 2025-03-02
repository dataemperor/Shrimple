import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Home from "../pages/Home";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} /> 
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Navigate to="/"/>} />
        </Routes>
    );
};

export default AppRoutes;
