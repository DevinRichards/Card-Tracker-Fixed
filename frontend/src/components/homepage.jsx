import React from 'react';
import { Link } from 'react-router-dom';

const Homepage = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-indigo-600 mb-4 animate-fade-in">Welcome to Card Tracker</h1>
                <p className="text-lg text-gray-700 mb-8 animate-slide-in">This is your one-stop solution for tracking your card collection.</p>
                <div className="space-x-4">
                    <Link to="/login" className="bg-indigo-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-600 transition duration-300 ease-in-out animate-bounce">
                        Login
                    </Link>
                    <Link to="/register" className="bg-indigo-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-600 transition duration-300 ease-in-out animate-bounce">
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Homepage;
