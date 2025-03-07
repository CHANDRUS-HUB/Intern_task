import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import Navbar from "./components/Navbar";
import HomePage from "./pages/Homepage";
import SignInForm from "./pages/SignInForm";
import SignUpForm from "./pages/SignUpForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <Navbar /> 
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<HomePage/>} />
        
          <Route path="/auth/signup" element={<SignUpForm />} />
        
          <Route path="/auth/signin" element={<SignInForm />} />
          
          {/* <Route path="/product-details" element={<ProductDetails />} />  */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
