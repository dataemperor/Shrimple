import Navbar from "./components/Navbar";
import {BrowserRouter as Router} from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Footer from "./components/Footer";
import './App.css';

function App() {
  return (
    <Router>
      <Navbar/>
      <AppRoutes/>
      <Footer/>   
    </Router>
  );
}

export default App;