import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AddProduct from "./pages/Addproduct";
import ProductDetails from "./pages/ProductDetails";
import DailyConsumption from "./pages/DailyConsumption";
import Dashboard from "./pages/DashBoard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <Navbar /> 
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Dashboard />} />
        
          <Route path="/add-product" element={<AddProduct />} />
        
          <Route path="/daily-consumption" element={<DailyConsumption />} />
          <Route path="/product-details" element={<ProductDetails />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
