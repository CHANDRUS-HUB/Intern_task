import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
// import Categories from "./pages/Categories";
import DailyConsumption from "./pages/dailyconsumption";
import Navbar from "./pages/Navbar"; 

function App() {
  return (
    <Router>
      <Navbar /> 
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/add-product" element={<AddProduct />} />
          {/* <Route path="/categories" element={<Categories />} /> */}
          <Route path="/daily-consumption" element={<DailyConsumption/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
