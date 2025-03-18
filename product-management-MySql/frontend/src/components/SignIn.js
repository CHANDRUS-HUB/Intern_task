import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { baseurl } from '../URL/url';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import AOS from 'aos';
const Signin = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [isSignIn, setIsSignIn] = useState(true);

    const toggleView = () => {
        setIsSignIn(!isSignIn);
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const validate = () => {
        let tempErrors = {};
        if (!email) tempErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(email)) tempErrors.email = "Invalid email format";

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

            const { message, token } = response.data;

            if (message === "Logged in successfully") {
                toast.success(message);
                localStorage.setItem('token', token);
                navigate("/home");  // Improved navigation
            } else {
                toast.error(message);
            }

            setEmail("");
            setPassword("");
        } catch (error) {
            setErrors({ general: "Login failed. Please try again." });
            toast.error(error?.response?.data?.message || "Login failed!");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: false,
            offset: 100,
        });

    }, []);

    return (
        <form onSubmit={handleSubmit} className="space-y-4 " data-aos="fade-up" >
            <div className="flex items-center justify-center min-h-screen bg-[#f9f3f8] p-4">

                <div className="bg-white shadow-lg rounded-lg flex flex-col md:flex-row w-full max-w-4xl">

                    {/* Left Side - Welcome Section */}
                    <div className="md:w-1/2  bg-purple-600 text-white flex flex-col items-center justify-start md:justify-center rounded-t-lg md:rounded-r-lg md:rounded-bl-none p-8">
                        <h1 className="text-3xl font-bold mt-3 mb-2">Welcome</h1>
                        <p className="text-center text-sm font-mono font-semibold mb-6">
                            Create account and manage your products.
                        </p>
                        <button

                            onClick={() => {
                                navigate("/signUp");
                                toggleView();
                            }}
                            className="bg-white text-purple-700 py-2 px-6 rounded-full font-medium hover:bg-gray-200 transition"
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Right Side - Sign In Form */}
                    <div className="md:w-1/2 flex flex-col justify-center p-8">
                        <h2 className="text-2xl font-bold text-purple-700 ml-0 mb-9">Sign In</h2>

                        <label className="text-sm font-semibold mb-3">Email</label>
                        <input
                            type="email"
                            placeholder="user@email.com"
                            className="w-full border border-gray rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

                        <label className="text-sm font-semibold mt-2 mb-3">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="w-full border border-gray-300 mb-2 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                                <button type="button" onClick={togglePasswordVisibility}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="bg-purple-700 mt-4 mb-1 text-white px-4 py-2 rounded-md hover:bg-purple-800 transition-transform transform hover:scale-105"
                                disabled={loading}
                            >
                                {loading ? "Logging in..." : "LOGIN"}
                            </button>
                        </div>
                        {errors.general && <p className="text-red-500 font-semibold text-xs">{errors.general}</p>}
                    </div>
                </div>
            </div>
        </form>
    );
};

export default Signin;
