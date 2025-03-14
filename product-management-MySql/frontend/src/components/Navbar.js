import React, { useState} from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import icon from "../assets/icon.png";
import { baseurl } from "../URL/url";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token") || null;


  // Logout logic
  const handleLogout = async () => {
    setLoading(true);
    try {
        // Send a request to backend to clear the cookie
        await fetch(`${baseurl}/logout`, {
            method: "POST",
            credentials: "include", // Ensures cookies are sent
        });

        // Remove token from localStorage (if stored there)
        const token=sessionStorage.removeItem("token");
        setUser(null);

        toast.success("Logged out successfully!");
        setShowLogoutModal(false);

        setTimeout(() => {
            setLoading(false);
            navigate("/signIn");
        }, 2000);
    } catch (error) {
        setLoading(false);
        toast.error("Error logging out!");
    }
};


  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-40">
          <h1 className="text-xl md:text-7xl font-bold text-white"></h1>
        </div>
      )}

      <nav className="bg-white shadow-md fixed top-0 w-full z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="" className="flex items-center space-x-3">
            <img src={icon} alt="Logo" className="h-12 w-auto" />
            <span className="text-gray-800 text-2xl font-bold hover:text-purple-700 transition-all">
              Product Management
            </span>
          </Link>

          <div className="hidden md:flex space-x-4">
            {  !token && token===null ? (
          
               <>
            
               <button
                className="hover:text-white shadow-xl font-bold hover:bg-purple-600 px-4 py-2 rounded-lg"
                onClick={() => navigate("/signUp")}
              >
                Sign Up
              </button>
              <button
                className="hover:text-white shadow-xl font-bold hover:bg-purple-600 px-4 py-2 rounded-lg"
                onClick={() => navigate("/signIn")}
              >
                Sign In
              </button>
             </>
          ) : (
            <>
                 
                 <NavLink to="/home" className="text-gray-700 text-lg font-semibold px-4 py-2 hover:bg-gray-100 rounded-md transition-all">
                 Home
               </NavLink>
               <NavLink to="/add-product" className="text-gray-700 text-lg font-semibold px-4 py-2 hover:bg-gray-100 rounded-md transition-all">
                 Add Product
               </NavLink>
               <NavLink to="/product-details" className="text-gray-700 text-lg font-semibold px-4 py-2 hover:bg-gray-100 rounded-md transition-all">
                 View Products
               </NavLink>
               <button
                 className="hover:text-white shadow-xl font-bold hover:bg-purple-600 px-4 py-2 rounded-lg"
                 onClick={() => setShowLogoutModal(true)}
               >
                 Log Out
               </button>
            </>
          )}
          </div>

          <button
            className="md:hidden text-gray-700 hover:text-purple-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <h3 className="text-lg font-semibold text-gray-700">
              Are you sure you want to log out?
            </h3>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 mr-2"
              >
                Yes, Log Out
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default Navbar;
