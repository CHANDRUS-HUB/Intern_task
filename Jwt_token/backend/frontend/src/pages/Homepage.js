import React from 'react';

const Homepage = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <header className="bg-blue-600 w-full py-4">
                <h1 className="text-white text-center text-3xl">Welcome to the Homepage</h1>
            </header>
            <main className="flex-grow flex flex-col items-center justify-center">
                <p className="text-gray-700 text-lg">This is a simple homepage using Tailwind CSS.</p>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Get Started
                </button>
            </main>
            <footer className="bg-gray-800 w-full py-4">
                <p className="text-white text-center">© 2023 Your Company</p>
            </footer>
        </div>
    );
};

export default Homepage;