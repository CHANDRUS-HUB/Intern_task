import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import AddProduct from "./pages/Addproduct";
import ProductDetails from "./pages/ProductDetails";
import DailyConsumption from "./pages/DailyConsumption";
import Dashboard from "./pages/DashBoard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignIn from "./pages/SignInPage";
import SignUp from "./pages/SignUpPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <Router>
            <ToastContainer position="top-right" autoClose={2000} />
            <div className="pt-20">
                <Routes>
                  
                    <Route path="/" element={<Navigate to="/signin" />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />

                    
                    <Route element={<ProtectedRoute />}>
                        <Route
                            path="/home"
                            element={
                                <>
                                    <Navbar />
                                    <Dashboard />
                                </>
                            }
                        />
                        <Route
                            path="/add-product"
                            element={
                                <>
                                    <Navbar />
                                    <AddProduct />
                                </>
                            }
                        />
                        <Route
                            path="/daily-consumption"
                            element={
                                <>
                                    <Navbar />
                                    <DailyConsumption />
                                </>
                            }
                        />
                        <Route
                            path="/product-details"
                            element={
                                <>
                                    <Navbar />
                                    <ProductDetails />
                                </>
                            }
                        />
                    </Route>

                    
                    <Route path="*" element={<Navigate to="/signin" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
