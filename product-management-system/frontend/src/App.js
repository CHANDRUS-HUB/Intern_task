import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import Categories from "./pages/Categories";
// import Analytics from "./pages/Analytics";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path="/products" element={<Products />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/categories" element={<Categories />} />
        {/* <Route path="/analytics" element={<Analytics />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
