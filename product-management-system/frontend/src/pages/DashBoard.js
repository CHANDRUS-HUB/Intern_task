import React from "react";
import logo from "../assets/logo.png";

const Dashboard = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between min-h-screen bg-gradient-to-r from-purple-600 to-indigo-700 p-10">
      
      <div className="text-white max-w-lg text-center md:text-left space-y-6">
        <h1 className="text-5xl font-extrabold leading-tight">
          Welcome to <span className="text-yellow-300">Product Management</span>
        </h1>
        <p className="text-lg opacity-90">
          Effortlessly manage product stock, updates, and daily consumption with a seamless interface.
        </p>
        <a 
          href="/product-details"
          className="inline-block bg-yellow-400 text-purple-900 font-semibold text-lg px-6 py-3 rounded-lg shadow-lg hover:bg-yellow-300 transition-all"
        >
          View Products
        </a>
      </div>

      
      <div className="hidden md:flex justify-end">
        <img src={logo} alt="Product Management System Logo" className="drop-shadow-lg" />
      </div>
    </div>
  );
};

export default Dashboard;
