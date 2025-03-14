import React, { useState } from 'react';
import axios from 'axios';
import { baseurl } from '../URL/url';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';



const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);



    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const validate = () => {
        let tempErrors = {};
        if (!email) tempErrors.email = "Email is required";
        if (!password) tempErrors.password = "Password is required";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);

        try {
            const response = await axios.post(
                `${baseurl}/login`,
                { email, password },
                { withCredentials: true }
            );
            if (response.data.message === "Logged in successfully") {
               
                window.location.href = "/home";
            }
            console.log("Response Data:", response.data); 
            console.log("Cookies (document.cookie):", document.cookie); 

            const token = response.data.token; 
            setEmail("")
            setPassword("")
            
            if (token ) {
                // console.log("Token received:", token);
                sessionStorage.setItem('token', token);
            } else {
                console.error("Token not received. Please try again.");
            }
        } catch (error) {
            console.error("Login error:", error);
            setErrors({ general: "Login failed. Please try again." });
            toast(error)
        } finally {
            setLoading(false);
        }
    };



    return (
        <>
            {/*  Full-Screen Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                    <div>
                    <img src="loading.gif" alt="Loading..." />
                    </div>
                </div>
            )}

            <div className="flex justify-center items-center h-screen bg-cover bg-center" style={{ backgroundImage: "url('./signin.jpg')" }}>
                <div className="w-full max-w-md bg-white p-8 opacity-85 rounded-lg shadow-md">
                    <div className='text-center'>
                        <img src="./ProductIcon.icon" className="h-14 pb-2 pt-0 inline" alt="ProductManagement Logo" />
                        <h1 className="text-2xl font-sans pt-1 font-bold">Product Management</h1>
                    </div>
                    <h2 className="text-lg font-sans mb-6 text-center text-blue-700">Access Your Account – Sign In Now</h2>

                    {/* 🌥️ Cloud-like error message */}
                    {errors.general && (
                        <p className="text-center text-md font-bold transition-opacity duration-500 opacity-100 animate-fadeIn mx-auto w-fit text-white bg-gradient-to-br from-pink-400 to-red-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 text-sm px-5 py-2.5 mb-2 shadow-xl rounded-full border border-white-300 backdrop-blur-md">
                            {errors.general}
                        </p>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-900 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {errors.email && <p className="text-red-500">{errors.email}</p>}
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-900 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                                    <button type="button" onClick={togglePasswordVisibility} className="focus:outline-none">
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                            {errors.password && <p className="text-red-500">{errors.password}</p>}
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Sign In
                            </button>
                            <p className="text-center mt-4">
                                Don't have an account? <a href="/signup" className="text-blue-700">Sign up</a>
                            </p>
                        </div>
                    </form>
                </div>

            </div>
        </>
    );
};

export default SignIn;