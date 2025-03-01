import { NavLink } from "react-router-dom";
import icon from "../assets/icon.png"; // Ensure this file exists

const Navbar = () => (
  <nav className="bg-white shadow-md fixed top-0 w-full z-50">
    <div className="container mx-auto px-6 py-4 flex justify-between items-center">
   
      <NavLink to="/" className="flex items-center">
        <img src={icon} alt="Logo" className="h-10 w-auto mr-2" />
        <span className="text-gray-700 text-2xl font-semibold hover:text-purple-600 transition">
          Product Management
        </span>
      </NavLink>

      {/* Navigation Links */}
      <div className="space-x-6">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `text-xl font-bold transition ${
              isActive ? "text-purple-800 underline" : "text-gray-700 hover:text-purple-600 hover:underline"
            }`
          }
        >
          Home
        </NavLink>

        <NavLink 
          to="/add-product" 
          className={({ isActive }) => 
            `text-xl font-bold transition ${
              isActive ? "text-purple-800 underline" : "text-gray-700 hover:text-purple-600 hover:underline"
            }`
          }
        >
          Add Product
        </NavLink>

        <NavLink 
          to="/daily-consumption" 
          className={({ isActive }) => 
            `text-xl font-bold transition ${
              isActive ? "text-purple-800 underline" : "text-gray-700 hover:text-purple-600 hover:underline"
            }`
          }
        >
          Daily Consumption
        </NavLink>

        <NavLink 
          to="/product-details" 
          className={({ isActive }) => 
            `text-xl font-bold transition ${
              isActive ? "text-purple-800 underline" : "text-gray-700 hover:text-purple-600 hover:underline"
            }`
          }
        >
          View Products
        </NavLink>
      </div>
    </div>
  </nav>
);

export default Navbar;
