import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // ✅ Import useNavigate
import axios from 'axios';
import {baseurl} from '../URL/url';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false); 

    const navigate = useNavigate(); 

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
    
            const { token } = response.data;
            if (token) {
                localStorage.setItem("authToken", token);
                toast.success("Login successful!");
                navigate('/home', { replace: true }); 
            } else {
                toast.error("Token not received. Please try again.");
            }
        } catch (error) {
            setLoading(false);
            if (error.response) {
                setErrors({ general: error.response.data.message || "Login failed!" });
            } else if (error.request) {
                toast.error("Network error! Please check your connection.");
            } else {
                toast.error("Unexpected error occurred.");
            }
        }
        
    };
    
    

    return (
        <>
            {/*  Full-Screen Loading Overlay */}
            {loading && (
               <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
               <div>
                 <h1 className="text-xl md:text-7xl font-bold text-white flex items-center">
                   L
                   <svg
                     stroke="currentColor"
                     fill="currentColor"
                     strokeWidth="0"
                     viewBox="0 0 24 24"
                     className="animate-spin"
                     height="1em"
                     width="1em"
                     xmlns="http://www.w3.org/2000/svg"
                   >
                     <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM13.6695 15.9999H10.3295L8.95053 17.8969L9.5044 19.6031C10.2897 19.8607 11.1286 20 12 20C12.8714 20 13.7103 19.8607 14.4956 19.6031L15.0485 17.8969L13.6695 15.9999ZM5.29354 10.8719L4.00222 11.8095L4 12C4 13.7297 4.54894 15.3312 5.4821 16.6397L7.39254 16.6399L8.71453 14.8199L7.68654 11.6499L5.29354 10.8719ZM18.7055 10.8719L16.3125 11.6499L15.2845 14.8199L16.6065 16.6399L18.5179 16.6397C19.4511 15.3312 20 13.7297 20 12L19.997 11.81L18.7055 10.8719ZM12 9.536L9.656 11.238L10.552 14H13.447L14.343 11.238L12 9.536ZM14.2914 4.33299L12.9995 5.27293V7.78993L15.6935 9.74693L17.9325 9.01993L18.4867 7.3168C17.467 5.90685 15.9988 4.84254 14.2914 4.33299ZM9.70757 4.33329C8.00021 4.84307 6.53216 5.90762 5.51261 7.31778L6.06653 9.01993L8.30554 9.74693L10.9995 7.78993V5.27293L9.70757 4.33329Z"></path>
                   </svg>
                   ading . . .
                 </h1>
               </div>
             </div>
            )}

            <div className="flex justify-center items-center h-screen bg-cover bg-center" style={{ backgroundImage: "url('./signin.jpg')" }}>
                <div className="w-full max-w-md bg-white p-8 opacity-85 rounded-lg shadow-md">
                    <div className='text-center'>
                        <img src="./ProductIcon.icon" className="h-14 pb-2 pt-0 inline" alt="ProductManagement Logo" />
                        <h1 className="text-2xl font-sans pt-1 font-bold">Product Management</h1>
                    </div>
                    <h2 className="text-lg font-serif mb-6 text-center text-blue-700">Access Your Account – Sign In Now!</h2>
                    
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