
import React from 'react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
  
      <header className="bg-purple-600 text-white p-4">
        <h1 className="text-4xl font-bold text-center">Welcome to home</h1>
      </header>

     
      <main className="flex-grow p-8 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold mb-4">Home Page</h2>
        <p className="text-gray-700 text-center">
         Welcome to home
        </p>
      </main>

     
     
    </div>
  );
};

export default HomePage;
