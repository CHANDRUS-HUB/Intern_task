import { NavLink } from "react-router-dom";
import icon from "../assets/icon.png"; 

const Navbar = () => (
  <nav className="bg-white shadow-lg fixed top-0 w-full z-50">
    <div className="container mx-auto px-6 py-4 flex justify-between items-center">
      
      <NavLink to="/" className="flex items-center space-x-3">
        <img src={icon} alt="Logo" className="h-12 w-auto" />
        <span className="text-gray-800 text-2xl font-bold tracking-wide hover:text-purple-700 transition-all">
          Product Management
        </span>
      </NavLink>

      
      <div className="flex space-x-8">
        {[
          { to: "/", label: "Home" },
          { to: "/add-product", label: "Add Product" },
          { to: "/daily-consumption", label: "Daily Consumption" },
          { to: "/product-details", label: "View Products" },
        ].map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative text-lg font-semibold px-4 py-2 rounded-md transition-all duration-200 
              ${
                isActive
                  ? "bg-purple-200 text-purple-800 shadow-md"
                  : "text-gray-700 hover:text-purple-600 hover:bg-gray-100"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </div>
  </nav>
);

export default Navbar;
