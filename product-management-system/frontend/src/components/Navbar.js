import { Link } from "react-router-dom";
import icon from "../assets/icon.png"; // Ensure this file exists

const Navbar = () => (
  <nav className="bg-white shadow-md fixed top-0 w-full z-50">
    <div className="container mx-auto px-6 py-4 flex justify-between items-center">
   
      <Link to="/" className="flex items-center">
        <img src={icon} alt="Logo" className="h-10 w-auto mr-2" />
        <span className="text-gray-700 text-2xl font-semibold hover:text-purple-600 transition">Product Management</span>
      </Link>

     
      <div className="space-x-6">
        <Link to="/" className="text-gray-700 text-xl font-bold hover:text-purple-800 transition">
         Home
        </Link>
        <Link to="/add-product" className="text-gray-700  text-xl font-bold  hover:text-purple-600 transition">
          Add Product
        </Link>
       

        <Link to="/daily-consumption" className="text-gray-700 text-xl font-bold hover:text-purple-600 transition">
          Daily Consumption
        </Link>

        <Link to="/product-details" className="text-gray-700 text-xl font-bold hover:text-purple-600 transition">View Products</Link> 

      </div>
    </div>
  </nav>
);

export default Navbar;
