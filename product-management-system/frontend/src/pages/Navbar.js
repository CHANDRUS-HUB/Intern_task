import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, PlusCircle, List, Menu, X } from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { to: "/products", label: "Manage Products", icon: <Package /> },
    { to: "/add-product", label: "Add Product", icon: <PlusCircle /> },
  
    { to: "/daily-consumption", label: "Daily Consumption", icon: <List /> }

  ];

  return (
    <nav className="bg-white text-purple-700 shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          
          <Link to="/" className="text-2xl font-bold text-purple-800">
            Product Management System
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            {links.map(({ to, label, icon }) => (
              <motion.div
                key={to}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to={to} 
                  className="flex items-center gap-2 px-4 py-2 rounded text-purple-700 hover:bg-purple-200 transition"
                >
                  {icon} {label}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} className="text-purple-700" /> : <Menu size={28} className="text-purple-700" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-purple-100"
        >
          {links.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className="block px-6 py-3 border-b border-purple-300 flex items-center gap-2 text-purple-700 hover:bg-purple-200 transition"
              onClick={() => setIsOpen(false)}
            >
              {icon} {label}
            </Link>
          ))}
        </motion.div>
      )}
    </nav>
  );
}

export default Navbar;
