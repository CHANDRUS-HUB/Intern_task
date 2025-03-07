// src/pages/HomePage.js
import React from 'react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
  
      <header className="bg-purple-600 text-white p-4">
        <h1 className="text-4xl font-bold text-center">Welcome to My App</h1>
      </header>

     
      <main className="flex-grow p-8 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold mb-4">Home Page</h2>
        <p className="text-gray-700 text-center">
          This is the home page of your application. Here you can include a welcome message, a summary of features, or any other content you want your users to see first.
        </p>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; {new Date().getFullYear()} My App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
