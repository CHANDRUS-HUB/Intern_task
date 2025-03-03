import React from "react";
import logo from "../assets/logo.png";

const Dashboard = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between min-h-screen bg-gradient-to-r from-purple-700 to-indigo-800 p-8 md:p-12 lg:p-16">
      {/* Text Section */}
      <div className="text-white max-w-xl text-center md:text-left space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Welcome to <span className="text-yellow-300">Product Management</span>
        </h1>
        <p className="text-lg md:text-xl opacity-90">
          Streamline product tracking, manage stock efficiently, and analyze daily consumption—all in one place.
        </p>
        <a
          href="/product-details"
          className="inline-block bg-yellow-400 text-purple-900 font-semibold text-lg md:text-xl px-6 py-3 rounded-lg shadow-md hover:bg-yellow-300 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          View Products
        </a>
      </div>

    
      <div className="mt-10 md:mt-0 flex justify-center md:justify-end">
        <img
          src={logo}
          alt="Product Management System Logo"
          className="drop-shadow-lg max-w-[250px] md:max-w-[300px] lg:max-w-[350px] object-contain"
        />
      </div>
    </div>
  );
};

export default Dashboard;
