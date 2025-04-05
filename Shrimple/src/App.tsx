import Navbar from "./components/Navbar";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Layout from './components/Layout.tsx';
import Footer from './components/Footer.tsx';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Layout>
        <AppRoutes />
      </Layout>
      <Footer />
    </Router>
  );
}

export default App;
