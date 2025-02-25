import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, PlusCircle, List, Menu, X } from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { to: "/products", label: "Manage Products", icon: <Package /> },
    { to: "/add-product", label: "Add Product", icon: <PlusCircle /> },
    { to: "/categories", label: "Manage Categories", icon: <List /> },
  ];

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
         
          <Link to="/" className="text-2xl font-bold">Product Management System</Link>

      
          <div className="hidden md:flex space-x-6">
            {links.map(({ to, label, icon }) => (
              <motion.div
                key={to}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to={to} className="flex items-center gap-2 px-4 py-2 rounded hover:bg-blue-700">
                  {icon} {label}
                </Link>
              </motion.div>
            ))}
          </div>

     
          <button className="md:hidden focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

    
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-blue-700"
        >
          {links.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className="block px-6 py-3 border-b border-blue-500 flex items-center gap-2"
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
