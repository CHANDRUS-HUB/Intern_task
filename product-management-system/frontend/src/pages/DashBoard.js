import React from "react";
import logo from "../assets/logo.png";

const Dashboard = () => {
  return (
    <div className="flex items-center justify-between min-h-screen bg-gradient-to-r from-purple-500 to-purple-700 p-10">
      
   
      <div className="text-white max-w-lg">
        <h1 className="text-4xl font-bold mb-4">Welcome to Product Management</h1>
        <p className="text-lg">
          Here you can track product stock, updates, and daily consumption in a seamless way.
        </p>
      </div>

  
      <div className="hidden md:block">
        <img src={logo} alt="Product Management System Logo" className="" />
      </div>
      
    </div>
  );
};

export default Dashboard;
